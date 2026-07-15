import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_STATUSES = ['new', 'contacted', 'converted'];

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
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { leadId, status } = await request.json();
    if (!leadId || !VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'leadId and a valid status are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId);

    if (error) {
      return Response.json({ error: 'Failed to update lead' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}