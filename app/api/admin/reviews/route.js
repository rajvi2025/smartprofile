import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
  if (requester?.role !== 'admin' && requester?.role !== 'staff') return null;
  return session;
}

export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    let matchingProfileIds = null;
    if (q) {
      const { data: matches } = await supabase.from('profiles').select('id').or(`business_name.ilike.%${q}%,username.ilike.%${q}%`);
      matchingProfileIds = (matches || []).map(m => m.id);
    }

    let query = supabase.from('testimonials').select('*').order('id', { ascending: false });
    if (q) {
      const filters = [`name.ilike.%${q}%`, `review.ilike.%${q}%`];
      if (matchingProfileIds && matchingProfileIds.length > 0) filters.push(`profile_id.in.(${matchingProfileIds.join(',')})`);
      query = query.or(filters.join(','));
    }

    const { data: testimonials, error } = await query;
    if (error) {
      console.error('Reviews query error:', error);
      return Response.json({ error: 'Failed to load reviews' }, { status: 500 });
    }

    const profileIds = [...new Set((testimonials || []).map(t => t.profile_id).filter(Boolean))];
    let profileMap = {};
    if (profileIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, username, business_name').in('id', profileIds);
      (profiles || []).forEach(p => { profileMap[p.id] = { name: p.business_name || p.username, username: p.username }; });
    }

    const rows = (testimonials || []).map(t => ({
      ...t,
      business_name: profileMap[t.profile_id]?.name || '—',
      username: profileMap[t.profile_id]?.username || null,
    }));

    return Response.json({ reviews: rows });
  } catch (err) {
    console.error('Reviews route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) {
      console.error('Review delete error:', error);
      return Response.json({ error: 'Failed to delete' }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch (err) {
    console.error('Review delete route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}