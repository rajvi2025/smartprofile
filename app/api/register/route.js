import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Creates a brand-new customer account (users table row) — this is the
// actual account-signup step, separate from creating a Digital Card/Directory
// profile (that happens later via /api/profile/create once logged in).
// Every new account gets a permanent, unique Customer ID (e.g. SP000003)
// generated atomically by the next_customer_id() DB function, so it can
// never collide even under concurrent signups.
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // One email = one account. Block duplicate registrations.
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .single();
    if (existing) {
      return Response.json({ error: 'An account with this email already exists. Please log in instead.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Atomically get the next Customer ID from the DB sequence-backed
    // function — guaranteed unique, no race conditions.
    const { data: cidResult, error: cidError } = await supabase.rpc('next_customer_id');
    if (cidError) {
      console.error('Customer ID generation error:', cidError);
      // Don't block signup over this — the account can still be created
      // without a Customer ID and backfilled later if the function call
      // ever fails for some reason.
    }
    const customerId = cidResult || null;

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{
        name,
        email: cleanEmail,
        password: passwordHash,
        role: 'customer',
        customer_id: customerId,
      }])
      .select()
      .single();

    if (userError) {
      console.error('User creation error:', userError);
      return Response.json({ error: 'Failed to create account', details: userError.message }, { status: 500 });
    }

    return Response.json({ success: true, user: { id: newUser.id, email: newUser.email, customer_id: newUser.customer_id } }, { status: 201 });

  } catch (err) {
    console.error('Register error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}