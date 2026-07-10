import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GALLERY_LIMITS = { basic: 0, business: 0, premium: 10, pro: 20 };

async function getOwnProfile(userId) {
  const { data } = await supabase.from('profiles').select('id, plan').eq('user_id', userId).single();
  return data;
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await getOwnProfile(session.user.id);
    if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 });

    const { image_url, caption } = await request.json();
    if (!image_url) return Response.json({ error: 'image_url required' }, { status: 400 });

    const limit = GALLERY_LIMITS[profile.plan] || 0;
    const { count } = await supabase
      .from('gallery')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    if ((count || 0) >= limit) {
      return Response.json({ error: `Gallery limit reached (${limit} photos on your plan)` }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert([{ profile_id: profile.id, image_url, caption: caption || null }])
      .select()
      .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true, item: data }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await getOwnProfile(session.user.id);
    if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 });

    const { id } = await request.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    // Ownership check: only delete a gallery row that belongs to this profile.
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)
      .eq('profile_id', profile.id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}