'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TYPE_LABELS = {
  signup: 'Signup',
  upgrade: 'Upgrade',
  renewal: 'Renewal',
  nfc_order: 'NFC Order',
  addon_chatbot: 'Chatbot Add-on',
};

const PLAN_OPTIONS = ['basic', 'business', 'premium', 'pro'];

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function PaymentsClient() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('');
  const [plan, setPlan] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce the search box so we're not firing a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Any filter change resets back to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, plan]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (type) params.set('type', type);
    if (plan) params.set('plan', plan);
    params.set('page', String(page));

    try {
      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      if (!res.ok) {
        setError('Failed to load payments.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows(data.rows || []);
      setTotal(data.total || 0);
      setPageSize(data.pageSize || 25);
    } catch (e) {
      setError('Failed to load payments.');
    }
    setLoading(false);
  }, [debouncedSearch, type, plan, page]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: '0 0 20px' }}>Payments</h1>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search business name or Razorpay ID..."
          style={{ flex: '1 1 280px', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, outline: 'none' }}
        />
        <select value={type} onChange={e => setType(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: 'white' }}>
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={plan} onChange={e => setPlan(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: 'white', textTransform: 'capitalize' }}>
          <option value="">All Plans</option>
          {PLAN_OPTIONS.map(p => <option key={p} value={p} style={{ textTransform: 'capitalize' }}>{p}</option>)}
        </select>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${total} transaction${total === 1 ? '' : 's'} found`}
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Date</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Business</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Type</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Plan</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Amount</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Coupon</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Razorpay Order ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Razorpay Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No transactions match your search.</td></tr>
              ) : (
                rows.map(r => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#334155', whiteSpace: 'nowrap' }}>{formatDateTime(r.created_at)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => router.push(`/admin/edit/${r.profile_id}`)}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#005DFF', fontWeight: 600, cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}
                      >
                        {r.business_name}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{TYPE_LABELS[r.type] || r.type}</td>
                    <td style={{ padding: '12px 16px', color: '#334155', textTransform: 'capitalize' }}>{r.plan || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#001144', fontWeight: 700 }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{r.coupon_code || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{r.razorpay_order_id || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{r.razorpay_payment_id || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: page === 1 ? '#f8fafc' : 'white', color: page === 1 ? '#cbd5e1' : '#334155', fontSize: 13, fontWeight: 600, cursor: page === 1 ? 'default' : 'pointer' }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: page === totalPages ? '#f8fafc' : 'white', color: page === totalPages ? '#cbd5e1' : '#334155', fontSize: 13, fontWeight: 600, cursor: page === totalPages ? 'default' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}