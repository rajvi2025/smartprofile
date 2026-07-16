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

    // "Stuck" = a payment we're still owed a profile for. Anything 'failed'
    // needs a human regardless of age; anything still 'pending' only counts
    // once it's had a few minutes to resolve on its own via the webhook —
    // most payments finish in seconds, so a still-pending row past that
    // window is the one worth surfacing.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: stuckPending } = await supabase
      .from('pending_signups')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lt('created_at', tenMinutesAgo);
    const { count: stuckFailed } = await supabase
      .from('pending_signups')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'failed');
    const stuckPayments = (stuckPending || 0) + (stuckFailed || 0);

    return Response.json({ activeCoupons: activeCoupons || 0, monthRevenue, stuckPayments });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}