import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Without a verified sending domain, Resend can only deliver to the email
// address the Resend account itself was signed up with — same constraint
// as the leads notification route.
const ORDER_NOTIFY_EMAIL = 'rajvi.ecom@gmail.com';

const CARD_LABELS = { black: 'Black Card', gold: 'Gold Card', silver: 'Metallic Silver Card' };
const NFC_CARD_PRICE = 599;

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, phone, email, business_name, delivery_address, notes, card_color,
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      coupon_id, coupon_code, discount_amount, amount_paid,
    } = body;

    if (!name?.trim() || !phone?.trim() || !delivery_address?.trim()) {
      return Response.json({ error: 'Name, phone, and delivery address are required.' }, { status: 400 });
    }

    // Payment is now mandatory at order time — no more "pay after design
    // approval". Verify the signature server-side ourselves rather than
    // trusting the client's earlier /api/razorpay/verify call, since that
    // call's result never reaches us otherwise.
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: 'Payment is required to place this order.' }, { status: 400 });
    }
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (expectedSignature !== razorpay_signature) {
      console.error('NFC order: payment signature mismatch — rejecting', razorpay_order_id);
      return Response.json({ error: 'Payment verification failed.' }, { status: 400 });
    }

    // The Razorpay order was created for this amount at
    // /api/nfc-orders/create-payment-order (already coupon-verified there),
    // so trust it here rather than re-deriving — same accepted pattern used
    // by the plan-upgrade flow (client-sent finalAmount, flagged in
    // payment-integrity notes for future server-side re-verification).
    const chargedAmount = Number(amount_paid);
    const finalAmount = (!isNaN(chargedAmount) && chargedAmount > 0) ? chargedAmount : NFC_CARD_PRICE;

    const { data, error } = await supabase
      .from('nfc_orders')
      .insert([{
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        business_name: business_name?.trim() || null,
        delivery_address: delivery_address.trim(),
        notes: notes?.trim() || null,
        card_color: card_color || 'black',
        status: 'design_pending',
        price: finalAmount,
        razorpay_order_id,
        razorpay_payment_id,
      }])
      .select('id')
      .single();

    if (error) {
      console.error('NFC order create error:', error);
      return Response.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Golden Rule: every paid flow must insert into payments. Signature is
    // already verified above, so this order is genuinely paid.
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        profile_id: null,
        user_id: null,
        type: 'nfc_order',
        plan: card_color || 'black',
        amount: finalAmount,
        razorpay_order_id,
        razorpay_payment_id,
        coupon_code: coupon_code || null,
      }]);
    if (paymentError) {
      // Don't fail the order over this — money is captured and the order
      // row is saved, but flag loudly since revenue reporting depends on it.
      console.error('NFC order: payments insert failed (order still saved)', paymentError);
    }

    // Record coupon redemption + bump used_count — only after the order and
    // payment are safely saved. coupon_redemptions.email is NOT NULL, so
    // fall back to phone for guest checkouts that skipped the email field.
    if (coupon_id) {
      try {
        await supabase.from('coupon_redemptions').insert([{
          coupon_id,
          profile_id: null,
          email: email?.trim() || phone.trim(),
          order_amount: NFC_CARD_PRICE,
          discount_amount: Number(discount_amount) || 0,
          final_amount: finalAmount,
          razorpay_order_id,
        }]);
        await supabase.rpc('increment_coupon_usage', { coupon_id_input: coupon_id });
      } catch (couponErr) {
        console.error('NFC order: coupon redemption record failed (non-fatal)', couponErr);
      }
    }

    // Email notification — best-effort, same as the leads route. If Resend
    // fails, the order is already safely saved and visible in Admin →
    // NFC Management, so we don't fail the request over it.
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SmartProfile Orders <onboarding@resend.dev>',
          to: ORDER_NOTIFY_EMAIL,
          subject: `New NFC Card Order (PAID): ${name}`,
          html: `
            <h2>New NFC card order — ₹${finalAmount} received${coupon_code ? ` (coupon ${coupon_code} applied)` : ''}</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email || '(not given)'}</p>
            <p><strong>Business:</strong> ${business_name || '(not given)'}</p>
            <p><strong>Card Color:</strong> ${CARD_LABELS[card_color] || card_color}</p>
            <p><strong>Delivery Address:</strong> ${delivery_address}</p>
            <p><strong>Notes:</strong> ${notes || '(none)'}</p>
            <p><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>
            <p style="color:#888;font-size:12px;">View and manage this order in Admin Dashboard → NFC Management.</p>
          `,
        }),
      });
    } catch (emailErr) {
      console.error('NFC order email notification failed:', emailErr);
    }

    return Response.json({ id: data.id });
  } catch (err) {
    console.error('NFC order route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}