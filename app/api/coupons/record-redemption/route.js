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
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const {
      couponId, profileId, email,
      orderAmount, discountAmount, finalAmount,
      razorpayOrderId,
    } = await request.json();

    if (!couponId || !profileId) {
      return Response.json({ success: false, error: 'couponId and profileId are required' }, { status: 400 });
    }

    const { error: insertError } = await supabase.from('coupon_redemptions').insert([{
      coupon_id: couponId,
      profile_id: profileId,
      email: email || session.user.email,
      order_amount: orderAmount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      razorpay_order_id: razorpayOrderId || null,
    }]);

    if (insertError) {
      return Response.json({ success: false, error: 'Failed to record redemption' }, { status: 500 });
    }

    await supabase.rpc('increment_coupon_usage', { coupon_id_input: couponId });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
