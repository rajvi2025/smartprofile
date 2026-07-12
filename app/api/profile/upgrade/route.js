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
    const { newPlan, amountPaid, razorpay_order_id, razorpay_payment_id, couponCode } = body;

    if (!ALLOWED_PLANS.includes(newPlan)) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // amountPaid is the ACTUAL amount the customer was charged (after any coupon
    // discount). If it's missing or invalid for some reason, fall back to the plan's
    // full list price rather than silently recording ₹0 — but this should be sent
    // by the client on every real upgrade.
    const chargedAmount = Number(amountPaid);
    const finalAmount = (!isNaN(chargedAmount) && chargedAmount > 0) ? chargedAmount : PLAN_PRICES[newPlan];

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
        amount_paid: finalAmount,
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

    // Record this transaction permanently — this is what powers accurate
    // revenue reporting, independent of whatever profiles.amount_paid says later.
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        profile_id: existingProfile.id,
        user_id: session.user.id,
        type: 'upgrade',
        plan: newPlan,
        amount: finalAmount,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,
        coupon_code: couponCode || null,
      }]);

    if (paymentError) {
      // Don't fail the whole request over this — the plan upgrade itself already
      // succeeded and the customer shouldn't be blocked. Just log it for follow-up.
      console.error('Payment record insert error:', paymentError);
    }

    return Response.json({ success: true, profile: data }, { status: 200 });

  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}