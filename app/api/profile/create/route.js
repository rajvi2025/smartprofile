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
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, full_name, designation, phone, email, business_name, business_type, category, city, state, bio, theme, plan } = body;

    if (!username || username.length < 3) {
      return Response.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    const usernameRegex = /^[a-z0-9-]+$/;
    if (!usernameRegex.test(username)) {
      return Response.json({ error: 'Username can only contain lowercase letters, numbers, and hyphens' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      return Response.json({ error: 'Username already taken' }, { status: 400 });
    }

    const allowedPlans = ['basic', 'business', 'premium', 'pro'];
    const finalPlan = allowedPlans.includes(plan) ? plan : 'basic';

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        user_id: session.user.id,
        username,
        full_name,
        designation,
        phone,
        email: email || session.user.email,
        business_name,
        business_type,
        category,
        city,
        state,
        bio,
        theme: theme || 'ocean',
        plan: finalPlan,
        is_active: true,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: 'Failed to create profile', details: error.message, fullError: error }, { status: 500 });
    }

    return Response.json({ success: true, profile: data }, { status: 201 });

  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}