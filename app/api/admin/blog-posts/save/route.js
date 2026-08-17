import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { id, title, slug, excerpt, content, cover_image, meta_description, author, status } = body;

    if (!title?.trim() || !content?.trim()) {
      return Response.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const finalSlug = slug?.trim() ? slugify(slug) : slugify(title);

    // Ensure slug uniqueness (excluding the post being edited).
    let dupeCheck = supabase.from('blog_posts').select('id').eq('slug', finalSlug);
    if (id) dupeCheck = dupeCheck.neq('id', id);
    const { data: dupes } = await dupeCheck;
    if (dupes && dupes.length > 0) {
      return Response.json({ error: `A post with the slug "${finalSlug}" already exists.` }, { status: 400 });
    }

    const payload = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() || null,
      content: content.trim(),
      cover_image: cover_image?.trim() || null,
      meta_description: meta_description?.trim() || null,
      author: author?.trim() || 'SmartProfile Team',
      status: status === 'published' ? 'published' : 'draft',
      updated_at: new Date().toISOString(),
    };

    if (id) {
      // If it's being published for the first time, stamp published_at.
      const { data: existing } = await supabase.from('blog_posts').select('status, published_at').eq('id', id).single();
      if (payload.status === 'published' && existing && existing.status !== 'published' && !existing.published_at) {
        payload.published_at = new Date().toISOString();
      }
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', id);
      if (error) {
        console.error('Blog post update error:', error);
        return Response.json({ error: 'Failed to update post' }, { status: 500 });
      }
      return Response.json({ success: true, id });
    } else {
      if (payload.status === 'published') payload.published_at = new Date().toISOString();
      const { data, error } = await supabase.from('blog_posts').insert([payload]).select('id').single();
      if (error) {
        console.error('Blog post create error:', error);
        return Response.json({ error: 'Failed to create post' }, { status: 500 });
      }
      return Response.json({ success: true, id: data.id });
    }
  } catch (err) {
    console.error('Blog post save route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}