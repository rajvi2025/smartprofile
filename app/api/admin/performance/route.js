import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '28d'; // 'today' | '7d' | '28d' | '90d' | '1y'

    const since = new Date();
    if (range === 'today') { /* since stays today, zeroed below */ }
    else if (range === '7d') since.setDate(since.getDate() - 6);
    else if (range === '90d') since.setDate(since.getDate() - 89);
    else if (range === '1y') since.setDate(since.getDate() - 364);
    else since.setDate(since.getDate() - 27);
    since.setHours(0, 0, 0, 0);

    const { data: events, error } = await supabase
      .from('profile_events')
      .select('profile_id, event_type')
      .gte('created_at', since.toISOString());

    if (error) {
      console.error('Performance query error:', error);
      return Response.json({ error: 'Failed to load performance data' }, { status: 500 });
    }

    // Platform-wide totals across every business, broken down by event
    // type — "how many WhatsApp clicks did everyone get today", etc.
    const overall = {
      view: 0, qr_scan: 0, whatsapp_click: 0, call_click: 0, save_contact: 0, directions_click: 0, product_click: 0,
      email_click: 0, website_click: 0, share_click: 0, social_click: 0, business_presence_click: 0,
    };
    (events || []).forEach(e => {
      if (overall[e.event_type] !== undefined) overall[e.event_type] += 1;
    });

    // Aggregate per profile: total views + total engagement (every event
    // type that isn't a plain view — calls, whatsapp, clicks, etc).
    const byProfile = {};
    (events || []).forEach(e => {
      if (!byProfile[e.profile_id]) byProfile[e.profile_id] = { views: 0, engagement: 0 };
      if (e.event_type === 'view') byProfile[e.profile_id].views += 1;
      else byProfile[e.profile_id].engagement += 1;
    });

    // Only paid customers — free-tier directory-only listings aren't
    // meaningful to rank here (they never had a digital card to track).
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, business_name, full_name, city, plan, is_active')
      .eq('is_active', true)
      .in('plan', ['basic', 'business', 'premium', 'pro']);

    const rows = (profiles || [])
      .map(p => ({
        id: p.id,
        username: p.username,
        business_name: p.business_name || p.full_name || p.username,
        city: p.city,
        plan: p.plan,
        is_active: p.is_active,
        views: byProfile[p.id]?.views || 0,
        engagement: byProfile[p.id]?.engagement || 0,
        total: (byProfile[p.id]?.views || 0) + (byProfile[p.id]?.engagement || 0),
      }))
      .sort((a, b) => b.views - a.views);

    return Response.json({ rows, overall });
  } catch (err) {
    console.error('Performance route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}