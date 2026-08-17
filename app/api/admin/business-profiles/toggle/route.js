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
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, field, value } = await request.json();
    if (!id || !['is_featured', 'is_verified'].includes(field)) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updates = { [field]: !!value };
    if (field === 'is_verified') {
      updates.verified_at = value ? new Date().toISOString() : null;
      updates.is_verified_by = value ? session.user.id : null;
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (error) {
      console.error('Toggle error:', error);
      return Response.json({ error: 'Failed to update' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Toggle route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}