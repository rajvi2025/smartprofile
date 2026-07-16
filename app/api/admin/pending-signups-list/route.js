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

    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: rows, error } = await supabase
      .from('pending_signups')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      return Response.json({ error: 'Failed to load pending signups' }, { status: 500 });
    }

    // Attach each customer's CIN + account name/email so the admin doesn't
    // have to cross-reference the users table separately.
    const userIds = [...new Set((rows || []).map(r => r.user_id).filter(Boolean))];
    let usersById = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, customer_id, name, email')
        .in('id', userIds);
      usersById = Object.fromEntries((users || []).map(u => [u.id, u]));
    }

    const items = (rows || []).map(r => ({
      id: r.id,
      status: r.status,
      created_at: r.created_at,
      completed_at: r.completed_at,
      razorpay_order_id: r.razorpay_order_id,
      customer_id: usersById[r.user_id]?.customer_id || null,
      customer_name: usersById[r.user_id]?.name || r.form_data?.full_name || null,
      customer_email: usersById[r.user_id]?.email || r.form_data?.email || null,
      business_name: r.form_data?.business_name || null,
      username: r.form_data?.username || null,
      plan: r.form_data?.plan || null,
      amount: r.form_data?.amount_paid ?? null,
    }));

    return Response.json({ items });
  } catch (err) {
    console.error('pending-signups-list error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}