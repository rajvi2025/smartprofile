import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Blog posts list error:', error);
      return Response.json({ error: 'Failed to load posts' }, { status: 500 });
    }
    return Response.json({ posts: data || [] });
  } catch (err) {
    console.error('Blog posts route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}