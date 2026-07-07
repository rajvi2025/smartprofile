import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

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

  const { profileId, updates } = await req.json();
  if (!profileId || !updates) {
    return NextResponse.json({ error: 'profileId and updates required' }, { status: 400 });
  }

  const safeUpdates = { ...updates };
  delete safeUpdates.id;
  delete safeUpdates.user_id;
  delete safeUpdates.created_at;

  const { error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', profileId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
