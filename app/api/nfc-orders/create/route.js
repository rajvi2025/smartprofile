import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Without a verified sending domain, Resend can only deliver to the email
// address the Resend account itself was signed up with — same constraint
// as the leads notification route.
const ORDER_NOTIFY_EMAIL = 'rajvi.ecom@gmail.com';

const CARD_LABELS = { black: 'Black Card', gold: 'Gold Card', silver: 'Metallic Silver Card' };

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, business_name, delivery_address, notes, card_color } = body;

    if (!name?.trim() || !phone?.trim() || !delivery_address?.trim()) {
      return Response.json({ error: 'Name, phone, and delivery address are required.' }, { status: 400 });
    }

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
      }])
      .select('id')
      .single();

    if (error) {
      console.error('NFC order create error:', error);
      return Response.json({ error: 'Failed to create order' }, { status: 500 });
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
          subject: `New NFC Card Order: ${name}`,
          html: `
            <h2>New NFC card order</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email || '(not given)'}</p>
            <p><strong>Business:</strong> ${business_name || '(not given)'}</p>
            <p><strong>Card Color:</strong> ${CARD_LABELS[card_color] || card_color}</p>
            <p><strong>Delivery Address:</strong> ${delivery_address}</p>
            <p><strong>Notes:</strong> ${notes || '(none)'}</p>
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