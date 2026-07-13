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
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { profileId, type, items } = await request.json();

    const tableMap = {
      products: 'products',
      services: 'services',
      testimonials: 'testimonials',
      // Bug fix: this used to point at 'business_links', a different table
      // than the one Edit Profile actually reads/writes ('business_presence'),
      // so entries added at signup never showed up when editing later.
      biz_presence: 'business_presence',
    };

    const table = tableMap[type];
    if (!table) return Response.json({ error: 'Invalid type' }, { status: 400 });

    const rows = items.map((item, i) => ({
      profile_id: profileId,
      ...item,
      sort_order: i,
    }));

    let { error } = await supabase.from(table).insert(rows);
    if (error && /sort_order/i.test(error.message || '')) {
      // Some tables (e.g. social_links, business_presence) may not have a
      // sort_order column — retry without it rather than failing the save.
      const rowsNoSort = items.map((item) => ({ profile_id: profileId, ...item }));
      ({ error } = await supabase.from(table).insert(rowsNoSort));
    }
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}