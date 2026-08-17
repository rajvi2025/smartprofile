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
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await request.json();
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      console.error('Blog post delete error:', error);
      return Response.json({ error: 'Failed to delete post' }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch (err) {
    console.error('Blog post delete route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}