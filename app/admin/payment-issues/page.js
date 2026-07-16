'use client';
import { useState, useEffect } from 'react';

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
  completed: { bg: '#dcfce7', text: '#166534', label: 'Recovered' },
  failed: { bg: '#fee2e2', text: '#dc2626', label: 'Needs Attention' },
};

const PLAN_LABELS = { basic: 'Basic', business: 'Business', premium: 'Premium', pro: 'Pro' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function minutesAgo(dateStr) {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
}

export default function PaymentIssuesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('needs_action'); // needs_action | all | pending | failed | completed
  const [recoveringId, setRecoveringId] = useState(null);
  const [recoverForm, setRecoverForm] = useState({}); // { [id]: { paymentId, username } }
  const [errorById, setErrorById] = useState({});

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/pending-signups-list');
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
    setLoading(false);
  }

  async function recover(item) {
    setRecoveringId(item.id);
    setErrorById(prev => ({ ...prev, [item.id]: null }));
    const form = recoverForm[item.id] || {};
    try {
      const res = await fetch('/api/admin/pending-signups-recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pendingId: item.id,
          razorpayPaymentId: form.paymentId || undefined,
          overrideUsername: form.username || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorById(prev => ({ ...prev, [item.id]: data.error || 'Recovery failed' }));
      } else {
        await fetchItems();
      }
    } catch {
      setErrorById(prev => ({ ...prev, [item.id]: 'Network error' }));
    }
    setRecoveringId(null);
  }

  const needsActionItems = items.filter(i => i.status === 'failed' || (i.status === 'pending' && minutesAgo(i.created_at) > 10));
  const filteredItems =
    filter === 'needs_action' ? needsActionItems :
    filter === 'all' ? items :
    items.filter(i => i.status === filter);

  const panelStyle = { background: 'white', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
  const selectStyle = { padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, color: '#0f172a', outline: 'none', cursor: 'pointer', background: 'white' };
  const inputStyle = { padding: '7px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, outline: 'none', width: '100%', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '26px 28px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>⚠️ Payment Issues</h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, maxWidth: 640 }}>
              Every signup attempt gets a row here the moment payment starts — before the customer ever pays.
              Most complete automatically (either the customer's browser or the Razorpay webhook finishes the job).
              What's left below is what still needs a look.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13, color: '#64748b' }}>Show:</label>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}>
              <option value="needs_action">Needs Action ({needsActionItems.length})</option>
              <option value="all">All ({items.length})</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="completed">Recovered</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>Loading…</div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', background: 'white', borderRadius: 12, marginTop: 20 }}>
            {filter === 'needs_action' ? 'Nothing needs attention right now. 🎉' : 'No records here.'}
          </div>
        ) : (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredItems.map(item => {
              const colors = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
              const isStuckPending = item.status === 'pending' && minutesAgo(item.created_at) > 10;
              const needsRecovery = item.status === 'failed' || isStuckPending;
              return (
                <div key={item.id} style={panelStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                          {item.business_name || item.customer_name || 'Unknown'}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, color: colors.text, background: colors.bg, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
                          {colors.label}{isStuckPending && item.status === 'pending' ? ` · ${minutesAgo(item.created_at)}m` : ''}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 3px', fontSize: 13, color: '#334155' }}>
                        <strong>CIN:</strong> {item.customer_id || '—'} &nbsp;·&nbsp; <strong>{item.customer_name || '—'}</strong> &nbsp;·&nbsp; {item.customer_email || '—'}
                      </p>
                      <p style={{ margin: '0 0 3px', fontSize: 13, color: '#334155' }}>
                        <strong>Plan:</strong> {PLAN_LABELS[item.plan] || item.plan || '—'} &nbsp;·&nbsp; <strong>Amount:</strong> {item.amount != null ? `₹${item.amount}` : '—'} &nbsp;·&nbsp; <strong>Username tried:</strong> {item.username || '—'}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>
                        Order: {item.razorpay_order_id} · Started {formatDate(item.created_at)}
                        {item.completed_at && ` · Recovered ${formatDate(item.completed_at)}`}
                      </p>
                    </div>

                    {needsRecovery && (
                      <div style={{ minWidth: 260, background: '#f8fafc', borderRadius: 10, padding: 12 }}>
                        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Recover manually</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <input
                            placeholder="Razorpay Payment ID (optional)"
                            value={recoverForm[item.id]?.paymentId || ''}
                            onChange={e => setRecoverForm(prev => ({ ...prev, [item.id]: { ...prev[item.id], paymentId: e.target.value } }))}
                            style={inputStyle}
                          />
                          <input
                            placeholder="Replacement username (only if taken)"
                            value={recoverForm[item.id]?.username || ''}
                            onChange={e => setRecoverForm(prev => ({ ...prev, [item.id]: { ...prev[item.id], username: e.target.value } }))}
                            style={inputStyle}
                          />
                          {errorById[item.id] && <p style={{ margin: 0, fontSize: 11.5, color: '#dc2626' }}>{errorById[item.id]}</p>}
                          <button
                            onClick={() => recover(item)}
                            disabled={recoveringId === item.id}
                            style={{ marginTop: 2, padding: '8px 10px', borderRadius: 8, border: 'none', background: '#2563eb', color: 'white', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', opacity: recoveringId === item.id ? 0.6 : 1 }}
                          >
                            {recoveringId === item.id ? 'Recovering…' : '✅ Create Profile Now'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}