import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWED_PLANS = ['basic', 'business', 'premium', 'pro'];
const PLAN_PRICES = { basic: 199, business: 399, premium: 599, pro: 999 };

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newPlan } = body;

    if (!ALLOWED_PLANS.includes(newPlan)) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const { data: existingProfile, error: findError } = await supabase
      .from('profiles')
      .select('id, plan')
      .eq('user_id', session.user.id)
      .single();

    if (findError || !existingProfile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    // Upgrading resets the billing cycle: the customer just paid the
    // prorated top-up amount, so from today they're on a fresh 365-day
    // cycle at the new plan's full price.
    const { data, error } = await supabase
      .from('profiles')
      .update({
        plan: newPlan,
        amount_paid: PLAN_PRICES[newPlan],
        plan_start_date: now.toISOString(),
        plan_end_date: oneYearLater.toISOString(),
      })
      .eq('id', existingProfile.id)
      .select()
      .single();

    if (error) {
      console.error('Upgrade update error:', error);
      return Response.json({ error: 'Failed to upgrade plan', details: error.message }, { status: 500 });
    }

    return Response.json({ success: true, profile: data }, { status: 200 });

  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}