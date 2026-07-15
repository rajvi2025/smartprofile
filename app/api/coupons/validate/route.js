import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ valid: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { code, orderAmount, planId, email } = await request.json();
    const useEmail = email || session.user.email;

    if (!code || typeof orderAmount !== 'number') {
      return Response.json({ valid: false, error: 'Coupon code and order amount are required' }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    const { data: coupon, error: fetchErr } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (fetchErr || !coupon) {
      return Response.json({ valid: false, error: 'This coupon code is not valid.' });
    }
    if (!coupon.is_active) {
      return Response.json({ valid: false, error: 'This coupon is not active.' });
    }

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return Response.json({ valid: false, error: 'This coupon is not active yet.' });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return Response.json({ valid: false, error: 'This coupon has expired.' });
    }

    if (coupon.applicable_product && coupon.applicable_product !== 'all' && coupon.applicable_product !== 'digital_card') {
      return Response.json({ valid: false, error: 'This coupon is not valid for Digital Card plans.' });
    }
    if (planId && coupon.applicable_plans && coupon.applicable_plans.length > 0 && !coupon.applicable_plans.includes(planId)) {
      return Response.json({ valid: false, error: 'This coupon is not valid for this plan.' });
    }
    if (coupon.min_order_value && orderAmount < Number(coupon.min_order_value)) {
      return Response.json({ valid: false, error: 'A minimum order of Rs.' + coupon.min_order_value + ' is required for this coupon.' });
    }

    if (coupon.usage_type === 'single_use' && (coupon.used_count || 0) >= 1) {
      return Response.json({ valid: false, error: 'This coupon has already been fully used.' });
    }
    if (coupon.usage_type === 'limited' && coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) {
      return Response.json({ valid: false, error: 'This coupon has reached its usage limit.' });
    }

    const { count: userUseCount } = await supabase
      .from('coupon_redemptions')
      .select('id', { count: 'exact', head: true })
      .eq('coupon_id', coupon.id)
      .eq('email', useEmail);
    if (coupon.per_user_limit && (userUseCount || 0) >= coupon.per_user_limit) {
      return Response.json({ valid: false, error: 'You have already used this coupon.' });
    }

    let discount;
    if (coupon.type === 'percentage') {
      discount = (Number(coupon.value) / 100) * orderAmount;
    } else if (coupon.type === 'final_price') {
      discount = orderAmount - Number(coupon.value);
    } else {
      discount = Number(coupon.value);
    }
    if (coupon.max_discount_cap && discount > Number(coupon.max_discount_cap)) {
      discount = Number(coupon.max_discount_cap);
    }
    discount = Math.max(0, Math.min(discount, orderAmount));
    discount = Math.round(discount * 100) / 100;

    const finalAmount = Math.max(1, Math.round((orderAmount - discount) * 100) / 100);

    return Response.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: discount,
      finalAmount: finalAmount,
    });
  } catch (err) {
    return Response.json({ valid: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
