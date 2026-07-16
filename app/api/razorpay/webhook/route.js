import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RESERVED_USERNAMES = [
  'directory', 'dashboard', 'admin', 'api', 'login', 'register', 'about',
  'contact', 'pricing', 'free-listing', 'terms', 'privacy', 'refund',
  'shipping', 'blog', 'home', 'search',
];

// This is the server-side safety net for the whole signup flow. Razorpay
// calls this URL directly (server-to-server) the moment a payment is
// captured — completely independent of the customer's browser. So even if
// their phone crashes, the tab reloads mid-UPI-redirect, or the network
// drops right after paying, this still runs and finishes the signup using
// the data stashed in `pending_signups` back when the order was created.
//
// Configure in Razorpay Dashboard → Settings → Webhooks:
//   URL: https://www.smartprofile.in/api/razorpay/webhook
//   Active events: payment.captured
//   Secret: put the same value in RAZORPAY_WEBHOOK_SECRET (.env.local + Vercel)

export async function POST(request) {
  let rawBody;
  try {
    rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return Response.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook: signature mismatch — rejecting');
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (err) {
    console.error('Webhook: could not read/verify request', err);
    return Response.json({ error: 'Bad request' }, { status: 400 });
  }

  try {
    const event = JSON.parse(rawBody);

    // We only act on successful captures — that's the only event that
    // means real money changed hands and a profile needs to exist for it.
    if (event.event !== 'payment.captured') {
      return Response.json({ received: true });
    }

    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    const paymentId = payment?.id;
    if (!orderId) {
      return Response.json({ received: true });
    }

    // Idempotency: if a payments row already exists for this order, either
    // the customer's own browser already finished the job, or we already
    // processed this webhook call before (Razorpay retries on timeout).
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();
    if (existingPayment) {
      return Response.json({ received: true, alreadyProcessed: true });
    }

    // This is an upgrade-plan payment, not a signup — different recovery
    // path, not handled here (upgrades don't need pending_signups since
    // the profile already exists before payment starts).
    const { data: pending } = await supabase
      .from('pending_signups')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();

    if (!pending) {
      console.error('Webhook: payment captured with no matching pending_signups row — investigate manually', orderId, paymentId);
      return Response.json({ received: true, noPendingRecord: true });
    }

    if (pending.status === 'completed') {
      return Response.json({ received: true, alreadyProcessed: true });
    }

    const fd = pending.form_data || {};

    // Guard against a username collision that happened between order
    // creation and this webhook firing. Rather than silently failing, mark
    // it 'failed' so it shows up in Admin → Payment Issues for manual
    // follow-up (the customer already paid — this needs a human).
    const markFailed = async (reason) => {
      await supabase.from('pending_signups').update({ status: 'failed' }).eq('id', pending.id);
      console.error('Webhook: marking pending_signups failed —', reason, pending.id);
    };

    if (!fd.username || RESERVED_USERNAMES.includes(fd.username)) {
      await markFailed('missing/reserved username');
      return Response.json({ received: true, failed: true });
    }

    const { data: usernameTaken } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', fd.username)
      .maybeSingle();
    if (usernameTaken) {
      await markFailed('username taken by the time webhook ran');
      return Response.json({ received: true, failed: true });
    }

    const allowedPlans = ['basic', 'business', 'premium', 'pro'];
    const finalPlan = allowedPlans.includes(fd.plan) ? fd.plan : 'basic';
    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const amountPaid = fd.amount_paid ?? (payment.amount ? payment.amount / 100 : 0);

    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: pending.user_id,
        username: fd.username,
        full_name: fd.full_name,
        designation: fd.designation,
        phone: fd.phone,
        email: fd.email,
        business_name: fd.business_name,
        business_type: fd.business_type,
        category: fd.category,
        city: fd.city,
        state: fd.state,
        area: fd.area || null,
        pincode: fd.pincode || null,
        display_as: fd.display_as || 'business',
        directory_active: fd.directory_active ?? true,
        business_id_type: fd.business_id_type || null,
        business_id_number: fd.business_id_number || null,
        bio: fd.bio,
        theme: fd.theme || 'ocean',
        plan: finalPlan,
        is_active: true,
        logo_url: fd.logo_url || null,
        banner_url: fd.banner_url || null,
        directory_image_url: fd.directory_image_url || null,
        whatsapp: fd.whatsapp || null,
        website: fd.website || null,
        about: fd.about || null,
        address: fd.address || null,
        maps_url: fd.maps_url || null,
        tagline: fd.tagline || null,
        video_url: fd.video_url || null,
        brochure_url: fd.brochure_url || null,
        amount_paid: amountPaid,
        plan_start_date: now.toISOString(),
        plan_end_date: oneYearLater.toISOString(),
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Webhook: profile insert error', profileError);
      await markFailed('profile insert failed: ' + profileError.message);
      return Response.json({ received: true, failed: true });
    }

    // This is the row that actually "closes the loop" — from this point
    // on, the payment is found, no matter what the browser did.
    const { error: paymentError } = await supabase.from('payments').insert([{
      profile_id: newProfile.id,
      user_id: pending.user_id,
      type: 'signup',
      plan: finalPlan,
      amount: amountPaid,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      coupon_code: fd.coupon_code || null,
    }]);
    if (paymentError) {
      console.error('Webhook: payments insert error (profile already created, non-fatal)', paymentError);
    }

    // Coupon redemption, if one was used.
    if (fd.coupon_code) {
      try {
        let couponId = fd.coupon_id || null;
        if (!couponId) {
          const { data: coupon } = await supabase
            .from('coupons')
            .select('id')
            .eq('code', fd.coupon_code)
            .maybeSingle();
          couponId = coupon?.id || null;
        }
        if (couponId) {
          await supabase.from('coupon_redemptions').insert([{
            coupon_id: couponId,
            profile_id: newProfile.id,
            email: fd.email,
            order_amount: fd.order_amount ?? null,
            discount_amount: fd.discount_amount ?? null,
            final_amount: amountPaid,
            razorpay_order_id: orderId,
          }]);
          await supabase.rpc('increment_coupon_usage', { coupon_id_input: couponId });
        }
      } catch (err) {
        console.error('Webhook: coupon redemption recovery failed (non-fatal)', err);
      }
    }

    // Social links
    const socialEntries = [
      { platform: 'Facebook', url: fd.facebook },
      { platform: 'Instagram', url: fd.instagram },
      { platform: 'YouTube', url: fd.youtube },
      { platform: 'LinkedIn', url: fd.linkedin },
      { platform: 'Twitter/X', url: fd.twitter },
      { platform: 'Threads', url: fd.threads },
      { platform: 'Pinterest', url: fd.pinterest },
      { platform: 'Telegram', url: fd.telegram },
    ].filter(s => s.url);
    if (socialEntries.length > 0) {
      const { error: socialError } = await supabase.from('social_links').insert(
        socialEntries.map(s => ({ profile_id: newProfile.id, platform: s.platform, url: s.url }))
      );
      if (socialError) console.error('Webhook: social_links insert error (non-fatal)', socialError);
    }

    // Products
    if (Array.isArray(fd.products) && fd.products.length > 0) {
      const { error: productsError } = await supabase.from('products').insert(
        fd.products.map((p, i) => ({ profile_id: newProfile.id, name: p.name, price: p.price || null, description: p.description || null, sort_order: i }))
      );
      if (productsError) console.error('Webhook: products insert error (non-fatal)', productsError);
    }

    // Business presence
    if (Array.isArray(fd.biz_presence) && fd.biz_presence.length > 0) {
      const { error: bizError } = await supabase.from('business_presence').insert(
        fd.biz_presence.map(b => ({ profile_id: newProfile.id, platform: b.platform, url: b.url }))
      );
      if (bizError) console.error('Webhook: business_presence insert error (non-fatal)', bizError);
    }

    await supabase
      .from('pending_signups')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', pending.id);

    console.log('Webhook: recovered signup successfully', { orderId, profileId: newProfile.id, username: fd.username });

    return Response.json({ received: true, recovered: true, profileId: newProfile.id });
  } catch (err) {
    console.error('Webhook: unhandled error', err);
    // Return 500 so Razorpay retries this webhook automatically — better
    // than silently swallowing a transient failure (e.g. a brief DB hiccup).
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}