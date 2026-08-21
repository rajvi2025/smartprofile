import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// NFC card checkout is guest — no login required, unlike the signup/upgrade
// Razorpay routes. Price is fixed server-side (never trust a client-sent
// amount) so a tampered request can't discount the order.
const NFC_CARD_PRICE = 599;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { couponCode, phone } = body;

    let finalAmount = NFC_CARD_PRICE;
    let couponId = null;
    let discountAmount = 0;

    // Re-check the coupon here (don't trust a discount the client already
    // "applied" client-side) — this is the amount that actually gets
    // charged, so it must be derived from the coupon row itself.
    if (couponCode?.trim()) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .single();

      const now = new Date();
      const usable = coupon
        && coupon.is_active
        && ['all', 'nfc_card'].includes(coupon.applicable_product)
        && (!coupon.valid_from || new Date(coupon.valid_from) <= now)
        && (!coupon.valid_until || new Date(coupon.valid_until) >= now)
        && !(coupon.usage_type === 'single_use' && (coupon.used_count || 0) >= 1)
        && !(coupon.usage_type === 'limited' && coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses);

      if (usable) {
        let discount;
        if (coupon.type === 'percentage') discount = (Number(coupon.value) / 100) * NFC_CARD_PRICE;
        else if (coupon.type === 'final_price') discount = NFC_CARD_PRICE - Number(coupon.value);
        else discount = Number(coupon.value);
        if (coupon.max_discount_cap && discount > Number(coupon.max_discount_cap)) discount = Number(coupon.max_discount_cap);
        discount = Math.max(0, Math.min(discount, NFC_CARD_PRICE));
        discount = Math.round(discount * 100) / 100;

        finalAmount = Math.max(1, Math.round((NFC_CARD_PRICE - discount) * 100) / 100);
        couponId = coupon.id;
        discountAmount = discount;
      }
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: 'INR',
      receipt: `nfc_${Date.now()}`,
      notes: { product: 'nfc_card', couponId: couponId || '' },
    });

    return NextResponse.json({ order, finalAmount, couponId, discountAmount });
  } catch (err) {
    console.error('NFC Razorpay order creation error:', err);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}