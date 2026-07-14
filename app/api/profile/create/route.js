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
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      username, full_name, designation, phone, email, business_name,
      business_type, category, city, state, area, pincode, bio, theme, plan, display_as,
      logo_url, banner_url, directory_image_url, whatsapp, website, about, address, maps_url,
      tagline, video_url, brochure_url,
      facebook, instagram, youtube, linkedin, twitter, threads, pinterest, telegram,
      amount_paid,
      razorpay_order_id, razorpay_payment_id, coupon_code,
      directory_active, business_id_type, business_id_number,
    } = body;

    if (!username || username.length < 3) {
      return Response.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return Response.json({ error: 'Username can only contain lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    const RESERVED_USERNAMES = [
      'directory', 'dashboard', 'admin', 'api', 'login', 'register', 'about',
      'contact', 'pricing', 'free-listing', 'terms', 'privacy', 'refund',
      'shipping', 'blog', 'home', 'search',
    ];
    if (RESERVED_USERNAMES.includes(username)) {
      return Response.json({ error: 'This username is reserved. Please choose a different one.' }, { status: 400 });
    }

    if (directory_active && !business_id_number) {
      return Response.json({ error: 'Business Identification Number is required to submit to the Directory' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      return Response.json({ error: 'Username already taken' }, { status: 400 });
    }

    const allowedPlans = ['basic', 'business', 'premium', 'pro'];
    const finalPlan = allowedPlans.includes(plan) ? plan : 'basic';

    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        user_id: session.user.id,
        username,
        full_name,
        designation,
        phone,
        email: email || session.user.email,
        business_name,
        business_type,
        category,
        city,
        state,
        area: area || null,
        pincode: pincode || null,
        display_as: display_as || 'business',
        directory_active: directory_active ?? true,
        business_id_type: business_id_type || null,
        business_id_number: business_id_number || null,
        bio,
        theme: theme || 'ocean',
        plan: finalPlan,
        is_active: true,
        logo_url: logo_url || null,
        banner_url: banner_url || null,
        directory_image_url: directory_image_url || null,
        whatsapp: whatsapp || null,
        website: website || null,
        about: about || null,
        address: address || null,
        maps_url: maps_url || null,
        tagline: tagline || null,
        video_url: video_url || null,
        brochure_url: brochure_url || null,
        // Billing cycle fields — amount_paid is the ACTUAL amount charged
        // (important once coupons/discounts exist, so it's never assumed
        // to equal the plan's list price).
        amount_paid: amount_paid ?? 0,
        plan_start_date: now.toISOString(),
        plan_end_date: oneYearLater.toISOString(),
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: 'Failed to create profile', details: error.message, fullError: error }, { status: 500 });
    }

    // Record this transaction permanently — this is what powers accurate
    // revenue reporting, independent of whatever profiles.amount_paid says later.
    // Mirrors the same insert done on upgrade (app/api/profile/upgrade/route.js)
    // so that both signups and upgrades show up in "This Month Revenue" and
    // the future Reports section.
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        profile_id: data.id,
        user_id: session.user.id,
        type: 'signup',
        plan: finalPlan,
        amount: amount_paid ?? 0,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,
        coupon_code: coupon_code || null,
      }]);

    if (paymentError) {
      // Don't fail the whole request over this — the profile itself already
      // got created and the customer shouldn't be blocked. Just log it for follow-up.
      console.error('Payment record insert error:', paymentError);
    }

    const socialEntries = [
      { platform: 'Facebook', url: facebook },
      { platform: 'Instagram', url: instagram },
      { platform: 'YouTube', url: youtube },
      { platform: 'LinkedIn', url: linkedin },
      { platform: 'Twitter/X', url: twitter },
      { platform: 'Threads', url: threads },
      { platform: 'Pinterest', url: pinterest },
      { platform: 'Telegram', url: telegram },
    ].filter(s => s.url);

    if (socialEntries.length > 0) {
      const { error: socialError } = await supabase
        .from('social_links')
        .insert(socialEntries.map(s => ({
          profile_id: data.id,
          platform: s.platform,
          url: s.url,
        })));
      if (socialError) {
        console.error('Social links insert error:', socialError);
      }
    }

    return Response.json({ success: true, profile: data }, { status: 201 });

  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}