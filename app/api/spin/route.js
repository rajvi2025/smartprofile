import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// The one coupon this wheel gives out. Kept server-side so it can't be
// tampered with from the browser.
const WIN_COUPON_CODE = 'SPIN11';
const WIN_CHANCE = 0.7; // 70% chance to win — keeps it feeling like a real spin, not guaranteed

export async function POST(request) {
  try {
    const { phone } = await request.json();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      return Response.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
    }

    // One spin per phone number, ever. If they already spun, just tell them
    // their previous result instead of erroring out.
    const { data: existing } = await supabase
      .from('spin_entries')
      .select('*')
      .eq('phone', cleanPhone)
      .single();

    if (existing) {
      return Response.json({
        alreadySpun: true,
        win: existing.won,
        code: existing.coupon_code,
      });
    }

    const win = Math.random() < WIN_CHANCE;
    const code = win ? WIN_COUPON_CODE : null;

    const { error } = await supabase
      .from('spin_entries')
      .insert([{ phone: cleanPhone, won: win, coupon_code: code }]);

    if (error) {
      console.error('Spin entry insert error:', error);
      return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    return Response.json({ alreadySpun: false, win, code });
  } catch (err) {
    console.error('Spin route error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}