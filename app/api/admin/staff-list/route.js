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
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (requester?.role !== 'admin') {
      return Response.json({ error: 'Only admins can view staff' }, { status: 403 });
    }

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('role', 'staff')
      .order('created_at', { ascending: false });

    if (usersError) {
      return Response.json({ error: 'Failed to load staff' }, { status: 500 });
    }

    const { data: perms } = await supabase
      .from('staff_permissions')
      .select('*');

    const merged = (users || []).map(u => ({
      ...u,
      perm: (perms || []).find(p => p.user_id === u.id) || null,
    }));

    return Response.json({ staff: merged });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
