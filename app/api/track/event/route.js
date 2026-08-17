import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_EVENTS = ['view', 'qr_scan', 'whatsapp_click', 'call_click', 'save_contact', 'directions_click', 'product_click', 'email_click', 'website_click', 'share_click', 'social_click', 'business_presence_click'];

export async function POST(request) {
  try {
    const { profile_id, event_type, session_id, device_type, source } = await request.json();

    if (!profile_id || !VALID_EVENTS.includes(event_type) || !session_id) {
      return Response.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Vercel populates these on every request at the edge — no geolocation
    // service or extra API call needed. Falls back gracefully to null when
    // running somewhere that doesn't set them (e.g. local dev).
    const city = request.headers.get('x-vercel-ip-city')
      ? decodeURIComponent(request.headers.get('x-vercel-ip-city'))
      : null;

    // Dedup: same profile + event type + visitor, already logged today —
    // skip it. Keeps counts meaningful (one visit = one view) without
    // needing real user accounts for anonymous visitors.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const { data: existingToday } = await supabase
      .from('profile_events')
      .select('id')
      .eq('profile_id', profile_id)
      .eq('event_type', event_type)
      .eq('session_id', session_id)
      .gte('created_at', startOfToday.toISOString())
      .limit(1);

    if (existingToday && existingToday.length > 0) {
      return Response.json({ success: true, deduped: true });
    }

    // New vs returning: has this visitor id ever generated a 'view' for
    // this profile before? Computed once per visit (on the view event) —
    // cheap to check, doesn't need its own table.
    let is_new_visitor = null;
    if (event_type === 'view') {
      const { data: priorVisit } = await supabase
        .from('profile_events')
        .select('id')
        .eq('profile_id', profile_id)
        .eq('session_id', session_id)
        .eq('event_type', 'view')
        .limit(1);
      is_new_visitor = !(priorVisit && priorVisit.length > 0);
    }

    const { error } = await supabase.from('profile_events').insert([{
      profile_id, event_type, session_id,
      device_type: device_type || null,
      source: source || null,
      city,
      is_new_visitor,
    }]);
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