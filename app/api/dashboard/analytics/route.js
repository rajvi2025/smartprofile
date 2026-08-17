import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', session.user.id).single();
    if (!profile) {
      return Response.json({ summary: { view: 0, qr_scan: 0, whatsapp_click: 0, call_click: 0 }, daily: [], hasProfile: false });
    }

    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);

    const { data: events, error } = await supabase
      .from('profile_events')
      .select('event_type, created_at')
      .eq('profile_id', profile.id)
      .gte('created_at', since.toISOString());

    if (error) {
      console.error('Analytics query error:', error);
      return Response.json({ error: 'Failed to load analytics' }, { status: 500 });
    }

    const summary = { view: 0, qr_scan: 0, whatsapp_click: 0, call_click: 0 };
    const dayMap = {};
    (events || []).forEach(e => {
      if (summary[e.event_type] !== undefined) summary[e.event_type] += 1;
      const day = e.created_at.slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + 1;
    });

    // Fill in every day of the range (even zero-activity days) so the
    // trend view has a continuous 30-day x-axis.
    const daily = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      daily.push({ date: key, count: dayMap[key] || 0 });
    }

    return Response.json({ summary, daily, hasProfile: true });
  } catch (err) {
    console.error('Analytics route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}