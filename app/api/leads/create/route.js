import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client using the SERVICE ROLE key. Saves leads
// captured by the chatbot (or any future lead source) and emails a
// notification via Resend. No SDK installs needed — both Resend and
// Supabase's REST layer are called with plain fetch.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Without a verified sending domain, Resend can only deliver to the email
// address the Resend account itself was signed up with.
const LEAD_NOTIFY_EMAIL = 'rajvi.ecom@gmail.com';

export async function POST(request) {
  try {
    const { name, contact, message, source } = await request.json();

    if (!contact || !String(contact).trim()) {
      return Response.json({ error: 'Contact info is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: name || null,
        contact: String(contact).trim(),
        message: message || null,
        source: source || 'chatbot_website',
      }])
      .select()
      .single();

    if (error) {
      console.error('Lead insert error:', error);
      return Response.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // Email notification — best-effort. If Resend fails, the lead is
    // already safely saved in the dashboard, so we don't fail the request.
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SmartProfile Leads <onboarding@resend.dev>',
          to: LEAD_NOTIFY_EMAIL,
          subject: `New Lead: ${name || 'Website visitor'}`,
          html: `
            <h2>New lead from SmartProfile chatbot</h2>
            <p><strong>Name:</strong> ${name || '(not given)'}</p>
            <p><strong>Contact:</strong> ${contact}</p>
            <p><strong>Message:</strong> ${message || '(none)'}</p>
            <p><strong>Source:</strong> ${source || 'chatbot_website'}</p>
            <p style="color:#888;font-size:12px;">View all leads in the Admin Dashboard → Leads.</p>
          `,
        }),
      });
    } catch (emailErr) {
      console.error('Lead email notification failed:', emailErr);
    }

    return Response.json({ success: true, lead: data }, { status: 201 });
  } catch (err) {
    console.error('Leads create route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}