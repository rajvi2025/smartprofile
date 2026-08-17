import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const VALID_STATUSES = ['design_pending', 'design_sent', 'design_approved', 'paid', 'shipped', 'delivered', 'cancelled'];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: requester } = await supabase.from('users').select('role').eq('id', session.user.id).single();
    if (requester?.role !== 'admin' && requester?.role !== 'staff') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, design_preview_url, tracking_number, admin_notes, amount, razorpay_order_id, razorpay_payment_id, coupon_code, link_username } = body;

    if (!id) {
      return Response.json({ error: 'Order id is required' }, { status: 400 });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabase.from('nfc_orders').select('*').eq('id', id).single();
    if (fetchError || !order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Resolve a linked profile by username, if the admin is attaching one —
    // this is how the "free Premium profile included" bundle gets tied to
    // the actual business account (created separately, same manual flow
    // used for complimentary signups) so the payment attributes correctly.
    let resolvedProfileId = order.profile_id;
    if (link_username) {
      const { data: linkedProfile } = await supabase.from('profiles').select('id').eq('username', link_username.trim()).single();
      if (!linkedProfile) {
        return Response.json({ error: `No business found with username "${link_username}"` }, { status: 400 });
      }
      resolvedProfileId = linkedProfile.id;
    }

    // Golden Rule: marking an order 'paid' for the first time must create a
    // matching payments row (type='nfc_order'). We key off the status
    // *transition* (not already paid/shipped/delivered) so re-saving an
    // already-paid order's tracking number etc. doesn't create duplicates.
    const alreadyPaid = ['paid', 'shipped', 'delivered'].includes(order.status);
    if (status === 'paid' && !alreadyPaid) {
      if (!amount) {
        return Response.json({ error: 'Amount is required to mark an order as paid' }, { status: 400 });
      }
      const { error: paymentError } = await supabase.from('payments').insert([{
        profile_id: resolvedProfileId || null,
        user_id: order.user_id || null,
        type: 'nfc_order',
        plan: order.card_color,
        amount,
        razorpay_order_id: razorpay_order_id || null,
        razorpay_payment_id: razorpay_payment_id || null,
        coupon_code: coupon_code || null,
      }]);
      if (paymentError) {
        console.error('NFC payment insert error:', paymentError);
        return Response.json({ error: 'Failed to record payment' }, { status: 500 });
      }
    }

    const updates = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (design_preview_url !== undefined) updates.design_preview_url = design_preview_url;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (amount) updates.price = amount;
    if (link_username) updates.profile_id = resolvedProfileId;

    const { error: updateError } = await supabase.from('nfc_orders').update(updates).eq('id', id);
    if (updateError) {
      console.error('NFC order update error:', updateError);
      return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('NFC order update route error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}