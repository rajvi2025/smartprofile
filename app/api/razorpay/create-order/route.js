import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, planId, username } = await req.json();

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

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}