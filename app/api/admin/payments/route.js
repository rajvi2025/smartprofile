import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PAGE_SIZE = 25;

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type') || '';
    const plan = searchParams.get('plan') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    // If searching by business name, resolve matching profile ids first —
    // payments.profile_id has no direct text column to search against.
    let matchingProfileIds = null;
    if (q) {
      const { data: matches } = await supabase
        .from('profiles')
        .select('id')
        .or(`business_name.ilike.%${q}%,full_name.ilike.%${q}%,username.ilike.%${q}%`);
      matchingProfileIds = (matches || []).map(m => m.id);
    }

    let query = supabase
      .from('payments')
      .select('id, profile_id, user_id, type, plan, amount, razorpay_order_id, razorpay_payment_id, coupon_code, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (plan) query = query.eq('plan', plan);

    if (q) {
      // A search term can match a business name (resolved above) OR a
      // Razorpay order/payment id directly — combine both with OR.
      const idFilters = [`razorpay_order_id.ilike.%${q}%`, `razorpay_payment_id.ilike.%${q}%`];
      if (matchingProfileIds && matchingProfileIds.length > 0) {
        idFilters.push(`profile_id.in.(${matchingProfileIds.join(',')})`);
      }
      query = query.or(idFilters.join(','));
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data: payments, count, error } = await query;
    if (error) {
      console.error('Payments query error:', error);
      return Response.json({ error: 'Failed to load payments' }, { status: 500 });
    }

    const profileIds = [...new Set((payments || []).map(p => p.profile_id).filter(Boolean))];
    let profileMap = {};
    if (profileIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, business_name, full_name')
        .in('id', profileIds);
      (profiles || []).forEach(p => {
        profileMap[p.id] = { name: p.business_name || p.full_name || p.username, username: p.username };
      });
    }

    const rows = (payments || []).map(p => ({
      ...p,
      business_name: profileMap[p.profile_id]?.name || '—',
      username: profileMap[p.profile_id]?.username || null,
    }));

    return Response.json({ rows, total: count || 0, page, pageSize: PAGE_SIZE });
  } catch (err) {
    console.error('Payments route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}