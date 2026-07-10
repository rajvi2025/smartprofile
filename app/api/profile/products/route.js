import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRODUCT_LIMITS = { basic: 0, business: 2, premium: 5, pro: 10 };

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

    const { id, name, price, description, image_url } = await request.json();
    if (!name) return Response.json({ error: 'name required' }, { status: 400 });

    if (id) {
      // Update — verify ownership via profile_id match.
      const { data, error } = await supabase
        .from('products')
        .update({ name, price: price || null, description: description || null, image_url: image_url || null })
        .eq('id', id)
        .eq('profile_id', profile.id)
        .select()
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true, item: data }, { status: 200 });
    }

    const limit = PRODUCT_LIMITS[profile.plan] || 0;
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    if ((count || 0) >= limit) {
      return Response.json({ error: `Product limit reached (${limit} products on your plan)` }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ profile_id: profile.id, name, price: price || null, description: description || null, image_url: image_url || null }])
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

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('profile_id', profile.id);

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}