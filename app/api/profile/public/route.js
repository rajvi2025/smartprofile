import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json({ error: 'Username required' }, { status: 400 });
  }

  // Profile fetch
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Sections fetch
  const [services, products, social, gallery, testimonials, bizlinks] = await Promise.all([
    supabase.from('services').select('*').eq('profile_id', profile.id),
    supabase.from('products').select('*').eq('profile_id', profile.id),
    supabase.from('social_links').select('*').eq('profile_id', profile.id),
    supabase.from('gallery').select('*').eq('profile_id', profile.id),
    supabase.from('testimonials').select('*').eq('profile_id', profile.id),
    supabase.from('business_presence').select('*').eq('profile_id', profile.id),
  ]);

  return Response.json({
    profile,
    sections: {
      services: services.data || [],
      products: products.data || [],
      social_links: social.data || [],
      gallery: gallery.data || [],
      testimonials: testimonials.data || [],
      business_presence: bizlinks.data || [],
    }
  });
}