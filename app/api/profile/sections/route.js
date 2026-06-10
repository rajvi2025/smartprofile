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
      biz_presence: 'business_links',
    };

    const table = tableMap[type];
    if (!table) return Response.json({ error: 'Invalid type' }, { status: 400 });

    const rows = items.map((item, i) => ({
      profile_id: profileId,
      ...item,
      sort_order: i,
    }));

    const { error } = await supabase.from(table).insert(rows);
    if (error) return Response.json({ error: error.message }, { status: 500 });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
