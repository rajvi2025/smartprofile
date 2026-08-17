import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { data: profile } = await supabase.from('profiles').select('id, username, business_name, full_name, city, plan').eq('id', id).single();
    if (!profile) return Response.json({ error: 'Business not found' }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '28d'; // 'today' | '7d' | '28d' | '90d' | '1y'

    let since = new Date();
    let bucketBy = 'day';
    if (range === 'today') { /* stays today */ }
    else if (range === '7d') since.setDate(since.getDate() - 6);
    else if (range === '90d') since.setDate(since.getDate() - 89);
    else if (range === '1y') { since.setDate(since.getDate() - 364); bucketBy = 'month'; }
    else since.setDate(since.getDate() - 27);
    since.setHours(0, 0, 0, 0);

    const { data: events, error } = await supabase
      .from('profile_events')
      .select('event_type, created_at, device_type, source, city, is_new_visitor')
      .eq('profile_id', id)
      .gte('created_at', since.toISOString());

    if (error) {
      console.error('Admin business analytics query error:', error);
      return Response.json({ error: 'Failed to load analytics' }, { status: 500 });
    }

    const summary = {
      view: 0, qr_scan: 0, whatsapp_click: 0, call_click: 0, save_contact: 0, directions_click: 0, product_click: 0,
      email_click: 0, website_click: 0, share_click: 0, social_click: 0, business_presence_click: 0,
    };
    const bucketMap = {};
    let newVisitors = 0, returningVisitors = 0;
    const deviceCounts = { mobile: 0, desktop: 0 };
    const sourceCounts = {};
    const cityCounts = {};

    (events || []).forEach(e => {
      if (summary[e.event_type] !== undefined) summary[e.event_type] += 1;
      const key = bucketBy === 'month' ? e.created_at.slice(0, 7) : e.created_at.slice(0, 10);
      bucketMap[key] = (bucketMap[key] || 0) + 1;

      if (e.event_type === 'view') {
        if (e.is_new_visitor === true) newVisitors += 1;
        else if (e.is_new_visitor === false) returningVisitors += 1;
        if (e.device_type === 'mobile' || e.device_type === 'desktop') deviceCounts[e.device_type] += 1;
        if (e.source) sourceCounts[e.source] = (sourceCounts[e.source] || 0) + 1;
        if (e.city) cityCounts[e.city] = (cityCounts[e.city] || 0) + 1;
      }
    });

    const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([city, count]) => ({ city, count }));

    const daily = [];
    if (bucketBy === 'day') {
      const numDays = range === 'today' ? 1 : range === '7d' ? 7 : range === '90d' ? 90 : 28;
      for (let i = 0; i < numDays; i++) {
        const d = new Date(since);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        daily.push({ date: key, count: bucketMap[key] || 0 });
      }
    } else {
      const cursor = new Date(since.getFullYear(), since.getMonth(), 1);
      const end = new Date();
      while (cursor <= end) {
        const key = cursor.toISOString().slice(0, 7);
        daily.push({ date: key, count: bucketMap[key] || 0 });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    }

    return Response.json({
      profile: { business_name: profile.business_name || profile.full_name || profile.username, username: profile.username, city: profile.city, plan: profile.plan },
      summary, daily, bucketBy,
      visitors: { new: newVisitors, returning: returningVisitors },
      devices: deviceCounts,
      sources: sourceCounts,
      topCities,
    });
  } catch (err) {
    console.error('Admin business analytics route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}