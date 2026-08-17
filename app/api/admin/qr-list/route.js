import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    let query = supabase
      .from('profiles')
      .select('id, username, business_name, full_name, city, is_active, plan')
      .order('business_name', { ascending: true });
    if (q) query = query.or(`business_name.ilike.%${q}%,full_name.ilike.%${q}%,username.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) {
      console.error('QR list error:', error);
      return Response.json({ error: 'Failed to load businesses' }, { status: 500 });
    }

    return Response.json({ profiles: data || [] });
  } catch (err) {
    console.error('QR list route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}