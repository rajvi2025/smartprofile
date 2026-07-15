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

    const { count: activeCoupons } = await supabase
      .from('coupons')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: monthPayments } = await supabase
      .from('payments')
      .select('amount')
      .gte('created_at', startOfMonth.toISOString());
    const monthRevenue = (monthPayments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return Response.json({ activeCoupons: activeCoupons || 0, monthRevenue });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
