'use client';
import { useState, useEffect, useCallback } from 'react';

const STATUS_LABELS = {
  design_pending: 'Design Pending',
  design_sent: 'Design Sent',
  design_approved: 'Design Approved',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS = {
  design_pending: { bg: '#fef3c7', text: '#b45309' },
  design_sent: { bg: '#dbeafe', text: '#1d4ed8' },
  design_approved: { bg: '#e0e7ff', text: '#4338ca' },
  paid: { bg: '#dcfce7', text: '#166534' },
  shipped: { bg: '#f3e8ff', text: '#7e22ce' },
  delivered: { bg: '#dcfce7', text: '#166534' },
  cancelled: { bg: '#fee2e2', text: '#b91c1c' },
};

const CARD_LABELS = { black: 'Black', gold: 'Gold', silver: 'Metallic Silver' };

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: c.bg, color: c.text }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function NfcOrdersClient() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [drafts, setDrafts] = useState({}); // per-order in-progress edits (tracking, amount, notes)
  const [uploading, setUploading] = useState(null); // order id currently uploading a design
  const [saving, setSaving] = useState(null); // order id currently saving

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/nfc-orders?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  function getDraft(order) {
    return drafts[order.id] || { tracking_number: order.tracking_number || '', amount: order.price || 599, admin_notes: order.admin_notes || '' };
  }
  function setDraft(orderId, patch) {
    setDrafts(prev => ({ ...prev, [orderId]: { ...getDraft(orders.find(o => o.id === orderId)), ...prev[orderId], ...patch } }));
  }

  async function handleDesignUpload(order, file) {
    setUploading(order.id);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'nfc-designs');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();
      await updateOrder(order.id, { design_preview_url: url });
    } catch (e) {
      alert('Design upload failed. Please try again.');
    }
    setUploading(null);
  }

  async function updateOrder(id, patch) {
    setSaving(id);
    try {
      const res = await fetch('/api/admin/nfc-orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Update failed.');
      } else {
        await fetchOrders();
      }
    } catch (e) {
      alert('Update failed.');
    }
    setSaving(null);
  }

  function nextActions(order) {
    const draft = getDraft(order);
    switch (order.status) {
      case 'design_pending':
        return (
          <button
            disabled={!order.design_preview_url || saving === order.id}
            onClick={() => updateOrder(order.id, { status: 'design_sent' })}
            style={btnStyle(!order.design_preview_url)}
          >
            Send Design to Customer
          </button>
        );
      case 'design_sent':
        return (
          <button disabled={saving === order.id} onClick={() => updateOrder(order.id, { status: 'design_approved' })} style={btnStyle(false)}>
            Mark Design Approved
          </button>
        );
      case 'design_approved':
        return (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#475569' }}>₹</span>
            <input type="number" value={draft.amount} onChange={e => setDraft(order.id, { amount: e.target.value })}
              style={{ width: 80, padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }} />
            <button disabled={saving === order.id} onClick={() => updateOrder(order.id, { status: 'paid', amount: Number(draft.amount) })} style={btnStyle(false)}>
              Mark as Paid
            </button>
          </div>
        );
      case 'paid':
        return (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Tracking number" value={draft.tracking_number} onChange={e => setDraft(order.id, { tracking_number: e.target.value })}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }} />
            <button disabled={!draft.tracking_number || saving === order.id} onClick={() => updateOrder(order.id, { status: 'shipped', tracking_number: draft.tracking_number })} style={btnStyle(!draft.tracking_number)}>
              Mark as Shipped
            </button>
          </div>
        );
      case 'shipped':
        return (
          <button disabled={saving === order.id} onClick={() => updateOrder(order.id, { status: 'delivered' })} style={btnStyle(false)}>
            Mark as Delivered
          </button>
        );
      default:
        return null;
    }
  }

  function btnStyle(disabled) {
    return { padding: '8px 16px', borderRadius: 8, border: 'none', background: disabled ? '#cbd5e1' : '#005DFF', color: 'white', fontSize: 13, fontWeight: 700, cursor: disabled ? 'default' : 'pointer' };
  }

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: '0 0 20px' }}>NFC Management</h1>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, or business..."
          style={{ flex: '1 1 260px', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: 'white' }}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
      </div>

      {!loading && orders.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          No NFC orders yet.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(order => (
          <div key={order.id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: 10 }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{order.name} {order.business_name ? `— ${order.business_name}` : ''}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{formatDate(order.created_at)} · {CARD_LABELS[order.card_color] || order.card_color} Card · ₹{order.price}</div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {expandedId === order.id && (
              <div style={{ padding: '0 18px 18px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '14px 0', fontSize: 13, color: '#334155' }}>
                  <div><strong>Phone:</strong> {order.phone}</div>
                  <div><strong>Email:</strong> {order.email || '—'}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Delivery Address:</strong> {order.delivery_address}</div>
                  {order.notes && <div style={{ gridColumn: '1 / -1' }}><strong>Customer Notes:</strong> {order.notes}</div>}
                  {order.tracking_number && <div><strong>Tracking:</strong> {order.tracking_number}</div>}
                </div>

                {/* Design preview */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>DESIGN PREVIEW</div>
                  {order.design_preview_url && (
                    <img src={order.design_preview_url} alt="Design preview" style={{ maxWidth: 220, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8, display: 'block' }} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading === order.id}
                    onChange={e => e.target.files[0] && handleDesignUpload(order, e.target.files[0])}
                    style={{ fontSize: 12 }}
                  />
                  {uploading === order.id && <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>Uploading...</span>}
                </div>

                {/* Linked business profile */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>LINKED BUSINESS PROFILE</div>
                  {order.profile_id ? (
                    <div style={{ fontSize: 13, color: '#166534', fontWeight: 600 }}>✓ Linked</div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="Enter their SmartProfile username"
                        value={getDraft(order).link_username || ''}
                        onChange={e => setDraft(order.id, { link_username: e.target.value })}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}
                      />
                      <button
                        disabled={!getDraft(order).link_username || saving === order.id}
                        onClick={() => updateOrder(order.id, { link_username: getDraft(order).link_username })}
                        style={btnStyle(!getDraft(order).link_username)}
                      >
                        Link
                      </button>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    Their free Premium Digital Card profile — create/upgrade it the usual way, then link the username here so the payment attributes to their account.
                  </div>
                </div>

                {/* Admin notes */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>ADMIN NOTES</div>
                  <textarea
                    value={getDraft(order).admin_notes}
                    onChange={e => setDraft(order.id, { admin_notes: e.target.value })}
                    onBlur={() => updateOrder(order.id, { admin_notes: getDraft(order).admin_notes })}
                    rows={2}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>

                {/* Status actions */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  {nextActions(order)}
                  {!['cancelled', 'delivered'].includes(order.status) && (
                    <button
                      disabled={saving === order.id}
                      onClick={() => { if (confirm('Cancel this order?')) updateOrder(order.id, { status: 'cancelled' }); }}
                      style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #fecaca', background: 'white', color: '#dc2626', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}