import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_EVENTS = ['view', 'qr_scan', 'whatsapp_click', 'call_click', 'save_contact', 'directions_click', 'product_click'];

export async function POST(request) {
  try {
    const { profile_id, event_type, session_id } = await request.json();

    if (!profile_id || !VALID_EVENTS.includes(event_type) || !session_id) {
      return Response.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Dedup: same profile + event type + session, already logged today —
    // skip it. Keeps counts meaningful (one visit = one view) without
    // needing real user accounts for anonymous visitors.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: existing } = await supabase
      .from('profile_events')
      .select('id')
      .eq('profile_id', profile_id)
      .eq('event_type', event_type)
      .eq('session_id', session_id)
      .gte('created_at', startOfToday.toISOString())
      .limit(1);

    if (existing && existing.length > 0) {
      return Response.json({ success: true, deduped: true });
    }

    const { error } = await supabase.from('profile_events').insert([{ profile_id, event_type, session_id }]);
    if (error) {
      console.error('Track event insert error:', error);
      return Response.json({ error: 'Failed to record event' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Track event route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}