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
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await request.json();
    if (!payload?.code || !payload?.value) {
      return Response.json({ error: 'Coupon code and value are required' }, { status: 400 });
    }

    const { error } = await supabase.from('coupons').insert([payload]);

    if (error) {
      const message = error.code === '23505' ? 'This coupon code already exists.' : (error.message || 'Failed to create coupon');
      return Response.json({ error: message }, { status: 400 });
    }

    return Response.json({ success: true }, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
