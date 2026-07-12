import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    // Only a real admin (not staff) can create staff accounts.
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: requester } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single();
    if (requester?.role !== 'admin') {
      return Response.json({ error: 'Only admins can create staff accounts' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, permissions, valid_until, allowed_ip, is_active } = body;

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();
    if (existing) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{
        name,
        email: email.toLowerCase().trim(),
        password: passwordHash,
        role: 'staff',
      }])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return Response.json({ error: 'Failed to create staff account', details: userError.message }, { status: 500 });
    }

    const { error: permError } = await supabase
      .from('staff_permissions')
      .insert([{
        user_id: newUser.id,
        permissions: permissions || [],
        valid_until: valid_until || null,
        allowed_ip: allowed_ip || null,
        is_active: is_active !== false,
        created_by: session.user.email,
      }]);

    if (permError) {
      console.error('Permissions creation error:', permError);
      // Roll back the user row so we don't leave an orphaned staff account without permissions.
      await supabase.from('users').delete().eq('id', newUser.id);
      return Response.json({ error: 'Failed to save permissions', details: permError.message }, { status: 500 });
    }

    return Response.json({ success: true, staffId: newUser.id }, { status: 201 });

  } catch (err) {
    console.error('Server error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}