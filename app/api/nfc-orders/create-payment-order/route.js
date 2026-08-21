import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// NFC card checkout is guest — no login required, unlike the signup/upgrade
// Razorpay routes. Price is fixed server-side (never trust a client-sent
// amount) so a tampered request can't discount the order.
const NFC_CARD_PRICE = 599;

export async function POST(req) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: NFC_CARD_PRICE * 100,
      currency: 'INR',
      receipt: `nfc_${Date.now()}`,
      notes: { product: 'nfc_card' },
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error('NFC Razorpay order creation error:', err);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}