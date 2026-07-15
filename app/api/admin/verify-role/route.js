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

    const { data, error } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', session.user.id)
      .single();

    if (error || !data) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    let perm = null;
    if (data.role === 'staff') {
      const { data: permRow } = await supabase
        .from('staff_permissions')
        .select('*')
        .eq('user_id', data.id)
        .single();
      perm = permRow || null;
    }

    return Response.json({ id: data.id, role: data.role, perm });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}