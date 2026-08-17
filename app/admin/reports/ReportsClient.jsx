'use client';
import { useState, useEffect, useCallback } from 'react';

const TYPE_LABELS = {
  signup: 'Signup',
  upgrade: 'Upgrade',
  renewal: 'Renewal',
  nfc_order: 'NFC Order',
  addon_chatbot: 'Chatbot Add-on',
};

const PRESETS = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Custom Range' },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

// Resolves a preset key into { from, to } ISO strings for the API.
// `to` is always the *start* of the day after the last day wanted, so the
// API's `lt` comparison includes the whole last day without an off-by-one.
function resolveRange(preset, customFrom, customTo) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  if (preset === 'today') {
    return { from: startOfToday.toISOString(), to: startOfTomorrow.toISOString() };
  }
  if (preset === '7d') {
    const from = new Date(startOfToday);
    from.setDate(from.getDate() - 6);
    return { from: from.toISOString(), to: startOfTomorrow.toISOString() };
  }
  if (preset === '30d') {
    const from = new Date(startOfToday);
    from.setDate(from.getDate() - 29);
    return { from: from.toISOString(), to: startOfTomorrow.toISOString() };
  }
  if (preset === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: from.toISOString(), to: startOfTomorrow.toISOString() };
  }
  if (preset === 'all') {
    return { from: null, to: null };
  }
  // custom
  if (customFrom && customTo) {
    const toExclusive = new Date(customTo);
    toExclusive.setDate(toExclusive.getDate() + 1);
    return { from: new Date(customFrom).toISOString(), to: toExclusive.toISOString() };
  }
  return { from: null, to: null };
}

function toCsv(rows) {
  const headers = ['Date', 'Business', 'Type', 'Plan', 'Amount', 'Coupon', 'Razorpay Order ID', 'Razorpay Payment ID'];
  const lines = [headers.join(',')];
  rows.forEach(r => {
    const line = [
      formatDateTime(r.created_at),
      r.business_name,
      TYPE_LABELS[r.type] || r.type,
      r.plan || '',
      r.amount,
      r.coupon_code || '',
      r.razorpay_order_id || '',
      r.razorpay_payment_id || '',
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`);
    lines.push(line.join(','));
  });
  return lines.join('\n');
}

export default function ReportsClient() {
  const [preset, setPreset] = useState('30d');
  const [customFrom, setCustomFrom] = useState(toDateInputValue(new Date(Date.now() - 29 * 86400000)));
  const [customTo, setCustomTo] = useState(toDateInputValue(new Date()));
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, totalCount: 0, byType: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    const { from, to } = resolveRange(preset, customFrom, customTo);
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);

    try {
      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      if (!res.ok) {
        setError('Failed to load report data.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows(data.rows || []);
      setSummary(data.summary || { totalAmount: 0, totalCount: 0, byType: {} });
    } catch (e) {
      setError('Failed to load report data.');
    }
    setLoading(false);
  }, [preset, customFrom, customTo]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  function handleExportCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartprofile-revenue-${toDateInputValue(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: 0 }}>Reports</h1>
        <button
          onClick={handleExportCsv}
          disabled={rows.length === 0}
          style={{ padding: '10px 18px', background: rows.length === 0 ? '#cbd5e1' : '#005DFF', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: rows.length === 0 ? 'default' : 'pointer' }}
        >
          Export CSV
        </button>
      </div>

      {/* Date range presets */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {PRESETS.map(p => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: preset === p.key ? '1.5px solid #005DFF' : '1.5px solid #e2e8f0',
              background: preset === p.key ? '#eff6ff' : 'white',
              color: preset === p.key ? '#005DFF' : '#475569',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === 'custom' && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <label style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
            From{' '}
            <input type="date" value={customFrom} max={customTo} onChange={e => setCustomFrom(e.target.value)}
              style={{ marginLeft: 6, padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }} />
          </label>
          <label style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
            To{' '}
            <input type="date" value={customTo} min={customFrom} max={toDateInputValue(new Date())} onChange={e => setCustomTo(e.target.value)}
              style={{ marginLeft: 6, padding: '6px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }} />
          </label>
        </div>
      )}

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Total Revenue</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#001144' }}>₹{summary.totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>Total Transactions</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#001144' }}>{summary.totalCount}</div>
        </div>
        {Object.entries(summary.byType).map(([type, v]) => (
          <div key={type} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 6 }}>{TYPE_LABELS[type] || type} ({v.count})</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#005DFF' }}>₹{v.amount.toLocaleString('en-IN')}</div>
          </div>
        ))}
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No transactions in this range.</td></tr>
              ) : (
                rows.map(r => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{formatDate(r.created_at)}</td>
                    <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>{r.business_name}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{TYPE_LABELS[r.type] || r.type}</td>
                    <td style={{ padding: '12px 16px', color: '#334155', textTransform: 'capitalize' }}>{r.plan || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#001144', fontWeight: 700 }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{r.coupon_code || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}