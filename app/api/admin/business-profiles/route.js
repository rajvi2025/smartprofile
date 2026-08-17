import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PAGE_SIZE = 25;

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
    const plan = searchParams.get('plan') || '';
    const status = searchParams.get('status') || '';
    const verified = searchParams.get('verified') || ''; // 'yes' | 'no' | ''
    const active = searchParams.get('active') || ''; // 'yes' | 'no' | ''
    const exportAll = searchParams.get('export') === '1';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    let query = supabase
      .from('profiles')
      .select('id, username, business_name, full_name, city, category, plan, status, is_active, is_verified, is_featured, created_at, amount_paid', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q) query = query.or(`business_name.ilike.%${q}%,full_name.ilike.%${q}%,username.ilike.%${q}%,city.ilike.%${q}%,category.ilike.%${q}%`);
    if (plan) query = query.eq('plan', plan);
    if (status) query = query.eq('status', status);
    if (verified === 'yes') query = query.eq('is_verified', true);
    if (verified === 'no') query = query.eq('is_verified', false);
    if (active === 'yes') query = query.eq('is_active', true);
    if (active === 'no') query = query.eq('is_active', false);

    // Bulk export ignores pagination and returns everything matching the
    // current filters, for the CSV download.
    if (!exportAll) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) {
      console.error('Business profiles query error:', error);
      return Response.json({ error: 'Failed to load profiles' }, { status: 500 });
    }

    return Response.json({ profiles: data || [], total: count || 0, page, pageSize: PAGE_SIZE });
  } catch (err) {
    console.error('Business profiles route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}