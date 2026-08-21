import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const NFC_CARD_PRICE = 599;

// NFC checkout is guest (no login), so this can't reuse /api/coupons/validate,
// which requires a session. Same discount math, but keyed by phone instead
// of an account email, and restricted to coupons whose applicable_product
// is 'all' or 'nfc_card'.
export async function POST(request) {
  try {
    const { code, phone } = await request.json();
    if (!code?.trim()) {
      return Response.json({ valid: false, error: 'Enter a coupon code.' }, { status: 400 });
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
    if (coupon.applicable_product && !['all', 'nfc_card'].includes(coupon.applicable_product)) {
      return Response.json({ valid: false, error: 'This coupon is not valid for NFC cards.' });
    }

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return Response.json({ valid: false, error: 'This coupon is not active yet.' });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return Response.json({ valid: false, error: 'This coupon has expired.' });
    }
    if (coupon.min_order_value && NFC_CARD_PRICE < Number(coupon.min_order_value)) {
      return Response.json({ valid: false, error: `A minimum order of ₹${coupon.min_order_value} is required.` });
    }

    if (coupon.usage_type === 'single_use' && (coupon.used_count || 0) >= 1) {
      return Response.json({ valid: false, error: 'This coupon has already been used.' });
    }
    if (coupon.usage_type === 'limited' && coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) {
      return Response.json({ valid: false, error: 'This coupon has reached its usage limit.' });
    }

    if (phone?.trim() && coupon.per_user_limit) {
      const { count: userUseCount } = await supabase
        .from('coupon_redemptions')
        .select('id', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('email', phone.trim());
      if ((userUseCount || 0) >= coupon.per_user_limit) {
        return Response.json({ valid: false, error: 'You have already used this coupon.' });
      }
    }

    let discount;
    if (coupon.type === 'percentage') {
      discount = (Number(coupon.value) / 100) * NFC_CARD_PRICE;
    } else if (coupon.type === 'final_price') {
      discount = NFC_CARD_PRICE - Number(coupon.value);
    } else {
      discount = Number(coupon.value);
    }
    if (coupon.max_discount_cap && discount > Number(coupon.max_discount_cap)) {
      discount = Number(coupon.max_discount_cap);
    }
    discount = Math.max(0, Math.min(discount, NFC_CARD_PRICE));
    discount = Math.round(discount * 100) / 100;

    const finalAmount = Math.max(1, Math.round((NFC_CARD_PRICE - discount) * 100) / 100);

    return Response.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: discount,
      finalAmount,
    });
  } catch (err) {
    console.error('NFC coupon validate error:', err);
    return Response.json({ valid: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}