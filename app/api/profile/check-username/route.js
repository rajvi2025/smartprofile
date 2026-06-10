import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username || username.length < 3) {
    return Response.json({ available: false, error: 'Too short' });
  }

  const usernameRegex = /^[a-z0-9-]+$/;
  if (!usernameRegex.test(username)) {
    return Response.json({ available: false, error: 'Invalid characters' });
  }

  const reserved = ['admin', 'login', 'register', 'dashboard', 'api', 'about', 'contact', 'home', 'search', 'directory'];
  if (reserved.includes(username)) {
    return Response.json({ available: false, error: 'Reserved username' });
  }

  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  return Response.json({ available: !data });
}