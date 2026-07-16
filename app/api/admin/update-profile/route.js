import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

// This route was missed when RLS was enabled on the `users` table (July 15
// security hardening) — it was still using the anon-key client from
// lib/supabase to check the caller's role, and RLS silently blocked that
// read, making every admin look unauthorized ("Forbidden") even when they
// weren't. Using the service-role client here (server-side only, never
// exposed to the browser) is what every other secure admin route already
// does, and is what actually lets this check see the real role.
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