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

    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (requester?.role !== 'admin') {
      return Response.json({ error: 'Only admins can change staff permissions' }, { status: 403 });
    }

    const { permId, is_active } = await request.json();
    if (!permId || typeof is_active !== 'boolean') {
      return Response.json({ error: 'permId and is_active are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('staff_permissions')
      .update({ is_active })
      .eq('id', permId);

    if (error) {
      return Response.json({ error: 'Failed to update permission' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
