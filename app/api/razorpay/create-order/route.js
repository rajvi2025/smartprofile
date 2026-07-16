import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, planId, username, profilePayload } = await req.json();

    if (!amount || !planId) {
      return NextResponse.json({ error: 'Missing amount or planId' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `sp_${planId}_${Date.now()}`,
      notes: { planId, username: username || '' },
    });

    // Stash the full signup form (business name, phone, address, plan,
    // coupon, already-uploaded image URLs — everything /api/profile/create
    // needs) BEFORE the customer ever sees the payment screen. If their
    // browser dies right after Razorpay captures the money (very common
    // with UPI app redirects on mobile), the webhook can still finish the
    // signup using this saved data instead of the payment being silently lost.
    if (profilePayload) {
      const { error: pendingError } = await supabase
        .from('pending_signups')
        .insert([{
          razorpay_order_id: order.id,
          user_id: session.user.id,
          form_data: profilePayload,
          status: 'pending',
        }]);
      if (pendingError) {
        // Don't block the payment over this, but log loudly — this row is
        // exactly the safety net the whole flow depends on.
        console.error('pending_signups insert error:', pendingError);
      }
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}