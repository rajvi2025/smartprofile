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
      full_name, designation, business_name, tagline, category, display_as, area, pincode, city, state,
      phone, whatsapp, website, about, address, maps_url,
      logo_url, banner_url, video_url, brochure_url, directory_image_url,
      facebook, instagram, youtube, linkedin, twitter,
      google, indiamart, justdial, tradeindia, exportersindia, alibaba,
    } = body;
    // Note: email and plan are intentionally NOT accepted here — email changes
    // require an admin/support request, and plan changes go through a separate
    // paid upgrade flow. Even if a client sends these fields, they're ignored.

    // Find the profile owned by this logged-in user.
    const { data: existingProfile, error: findError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('user_id', session.user.id)
      .single();

    if (findError || !existingProfile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name, designation, business_name, tagline, category, city, state,
        display_as: display_as || 'business',
        area: area || null,
        pincode: pincode || null,
        phone,
        whatsapp: whatsapp || null,
        website: website || null,
        about: about || null,
        address: address || null,
        maps_url: maps_url || null,
        logo_url: logo_url || null,
        banner_url: banner_url || null,
        directory_image_url: directory_image_url || null,
        video_url: video_url || null,
        brochure_url: brochure_url || null,
      })
      .eq('id', existingProfile.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return Response.json({ error: 'Failed to update profile', details: error.message }, { status: 500 });
    }

    // Social links: simplest reliable approach is to clear existing rows for
    // this profile and re-insert the current set from the form.
    await supabase.from('social_links').delete().eq('profile_id', existingProfile.id);

    const socialEntries = [
      { platform: 'Facebook', url: facebook },
      { platform: 'Instagram', url: instagram },
      { platform: 'YouTube', url: youtube },
      { platform: 'LinkedIn', url: linkedin },
      { platform: 'Twitter', url: twitter },
    ].filter(s => s.url);

    if (socialEntries.length > 0) {
      const { error: socialError } = await supabase
        .from('social_links')
        .insert(socialEntries.map(s => ({
          profile_id: existingProfile.id,
          platform: s.platform,
          url: s.url,
        })));
      if (socialError) {
        console.error('Social links update error:', socialError);
      }
    }

    // Business Presence: same delete-then-reinsert pattern as social links.
    await supabase.from('business_presence').delete().eq('profile_id', existingProfile.id);

    const bizEntries = [
      { platform: 'Google Business', url: google },
      { platform: 'IndiaMART', url: indiamart },
      { platform: 'JustDial', url: justdial },
      { platform: 'TradeIndia', url: tradeindia },
      { platform: 'ExportersIndia', url: exportersindia },
      { platform: 'Alibaba', url: alibaba },
    ].filter(b => b.url);

    if (bizEntries.length > 0) {
      const { error: bizError } = await supabase
        .from('business_presence')
        .insert(bizEntries.map(b => ({
          profile_id: existingProfile.id,
          platform: b.platform,
          url: b.url,
        })));
      if (bizError) {
        console.error('Business presence update error:', bizError);
      }
    }

    return Response.json({ success: true, profile: data }, { status: 200 });

  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}