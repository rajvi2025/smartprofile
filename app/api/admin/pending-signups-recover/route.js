import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RESERVED_USERNAMES = [
  'directory', 'dashboard', 'admin', 'api', 'login', 'register', 'about',
  'contact', 'pricing', 'free-listing', 'terms', 'privacy', 'refund',
  'shipping', 'blog', 'home', 'search',
];

// Manual backup for the webhook. Used from Admin → Payment Issues when a
// payment was captured but the automatic recovery couldn't finish it on its
// own (e.g. a username collision) — the admin supplies whatever is missing
// (a Razorpay Payment ID, or a replacement username) and this finishes the
// signup exactly the way the webhook would have.
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { pendingId, razorpayPaymentId, overrideUsername } = await request.json();
    if (!pendingId) {
      return Response.json({ error: 'pendingId required' }, { status: 400 });
    }

    const { data: pending, error: fetchErr } = await supabase
      .from('pending_signups')
      .select('*')
      .eq('id', pendingId)
      .single();
    if (fetchErr || !pending) {
      return Response.json({ error: 'Pending signup not found' }, { status: 404 });
    }
    if (pending.status === 'completed') {
      return Response.json({ error: 'This one is already completed' }, { status: 400 });
    }

    // Already recovered under this order (e.g. webhook beat us to it while
    // this admin page was open) — don't create a second profile.
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, profile_id')
      .eq('razorpay_order_id', pending.razorpay_order_id)
      .maybeSingle();
    if (existingPayment) {
      await supabase.from('pending_signups').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', pending.id);
      return Response.json({ success: true, alreadyExisted: true });
    }

    const fd = pending.form_data || {};
    const username = (overrideUsername || fd.username || '').toLowerCase().trim();

    if (!username || username.length < 3 || !/^[a-z0-9-]+$/.test(username) || RESERVED_USERNAMES.includes(username)) {
      return Response.json({ error: 'Invalid or missing username — supply overrideUsername' }, { status: 400 });
    }

    const { data: usernameTaken } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    if (usernameTaken) {
      return Response.json({ error: `Username "${username}" is already taken — supply a different overrideUsername` }, { status: 400 });
    }

    const allowedPlans = ['basic', 'business', 'premium', 'pro'];
    const finalPlan = allowedPlans.includes(fd.plan) ? fd.plan : 'basic';
    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const amountPaid = fd.amount_paid ?? 0;

    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        user_id: pending.user_id,
        username,
        full_name: fd.full_name,
        designation: fd.designation,
        phone: fd.phone,
        email: fd.email,
        business_name: fd.business_name,
        business_type: fd.business_type,
        category: fd.category,
        city: fd.city,
        state: fd.state,
        area: fd.area || null,
        pincode: fd.pincode || null,
        display_as: fd.display_as || 'business',
        directory_active: fd.directory_active ?? true,
        business_id_type: fd.business_id_type || null,
        business_id_number: fd.business_id_number || null,
        bio: fd.bio,
        theme: fd.theme || 'ocean',
        plan: finalPlan,
        is_active: true,
        logo_url: fd.logo_url || null,
        banner_url: fd.banner_url || null,
        directory_image_url: fd.directory_image_url || null,
        whatsapp: fd.whatsapp || null,
        website: fd.website || null,
        about: fd.about || null,
        address: fd.address || null,
        maps_url: fd.maps_url || null,
        tagline: fd.tagline || null,
        video_url: fd.video_url || null,
        brochure_url: fd.brochure_url || null,
        amount_paid: amountPaid,
        plan_start_date: now.toISOString(),
        plan_end_date: oneYearLater.toISOString(),
      }])
      .select()
      .single();

    if (profileError) {
      return Response.json({ error: 'Profile insert failed: ' + profileError.message }, { status: 500 });
    }

    await supabase.from('payments').insert([{
      profile_id: newProfile.id,
      user_id: pending.user_id,
      type: 'signup',
      plan: finalPlan,
      amount: amountPaid,
      razorpay_order_id: pending.razorpay_order_id,
      razorpay_payment_id: razorpayPaymentId || null,
      coupon_code: fd.coupon_code || null,
    }]);

    if (fd.coupon_code) {
      let couponId = fd.coupon_id || null;
      if (!couponId) {
        const { data: coupon } = await supabase.from('coupons').select('id').eq('code', fd.coupon_code).maybeSingle();
        couponId = coupon?.id || null;
      }
      if (couponId) {
        await supabase.from('coupon_redemptions').insert([{
          coupon_id: couponId,
          profile_id: newProfile.id,
          email: fd.email,
          order_amount: fd.order_amount ?? null,
          discount_amount: fd.discount_amount ?? null,
          final_amount: amountPaid,
          razorpay_order_id: pending.razorpay_order_id,
        }]);
        await supabase.rpc('increment_coupon_usage', { coupon_id_input: couponId });
      }
    }

    const socialEntries = [
      { platform: 'Facebook', url: fd.facebook }, { platform: 'Instagram', url: fd.instagram },
      { platform: 'YouTube', url: fd.youtube }, { platform: 'LinkedIn', url: fd.linkedin },
      { platform: 'Twitter/X', url: fd.twitter }, { platform: 'Threads', url: fd.threads },
      { platform: 'Pinterest', url: fd.pinterest }, { platform: 'Telegram', url: fd.telegram },
    ].filter(s => s.url);
    if (socialEntries.length > 0) {
      await supabase.from('social_links').insert(socialEntries.map(s => ({ profile_id: newProfile.id, platform: s.platform, url: s.url })));
    }
    if (Array.isArray(fd.products) && fd.products.length > 0) {
      await supabase.from('products').insert(fd.products.map((p, i) => ({ profile_id: newProfile.id, name: p.name, price: p.price || null, description: p.description || null, sort_order: i })));
    }
    if (Array.isArray(fd.biz_presence) && fd.biz_presence.length > 0) {
      await supabase.from('business_presence').insert(fd.biz_presence.map(b => ({ profile_id: newProfile.id, platform: b.platform, url: b.url })));
    }

    await supabase.from('pending_signups').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', pending.id);

    return Response.json({ success: true, profile: newProfile });
  } catch (err) {
    console.error('pending-signups-recover error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}