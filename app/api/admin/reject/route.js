import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('email', session.user.email)
    .single();

  if (userRow?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { profileId } = await req.json();
  if (!profileId) {
    return NextResponse.json({ error: 'profileId required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status: 'rejected', is_active: false })
    .eq('id', profileId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}