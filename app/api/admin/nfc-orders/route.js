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
    const status = searchParams.get('status') || '';
    const q = (searchParams.get('q') || '').trim();

    let query = supabase.from('nfc_orders').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    if (q) query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,business_name.ilike.%${q}%`);

    const { data, error } = await query;
    if (error) {
      console.error('NFC orders list error:', error);
      return Response.json({ error: 'Failed to load orders' }, { status: 500 });
    }

    return Response.json({ orders: data || [] });
  } catch (err) {
    console.error('NFC orders route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}