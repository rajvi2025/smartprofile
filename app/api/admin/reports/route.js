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

    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = supabase
      .from('payments')
      .select('id, profile_id, user_id, type, plan, amount, razorpay_order_id, razorpay_payment_id, coupon_code, created_at')
      .order('created_at', { ascending: false });

    if (from) query = query.gte('created_at', from);
    if (to) query = query.lt('created_at', to);

    const { data: payments, error } = await query;
    if (error) {
      console.error('Reports query error:', error);
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
        profileMap[p.id] = p.business_name || p.full_name || p.username;
      });
    }

    const rows = (payments || []).map(p => ({
      ...p,
      business_name: profileMap[p.profile_id] || '—',
    }));

    const summary = {
      totalAmount: rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
      totalCount: rows.length,
      byType: {},
    };
    rows.forEach(r => {
      const key = r.type || 'other';
      if (!summary.byType[key]) summary.byType[key] = { count: 0, amount: 0 };
      summary.byType[key].count += 1;
      summary.byType[key].amount += Number(r.amount) || 0;
    });

    return Response.json({ rows, summary });
  } catch (err) {
    console.error('Reports route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}