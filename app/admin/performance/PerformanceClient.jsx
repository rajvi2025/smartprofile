'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const RANGES = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7 Days' },
  { key: '28d', label: '28 Days' },
  { key: '90d', label: '3 Months' },
  { key: '1y', label: '1 Year' },
];

const OVERALL_CARDS = [
  { key: 'view', label: 'Total Views', icon: '👁️', color: '#005DFF' },
  { key: 'whatsapp_click', label: 'WhatsApp Clicks', icon: '💬', color: '#166534' },
  { key: 'call_click', label: 'Call Clicks', icon: '📞', color: '#b45309' },
  { key: 'qr_scan', label: 'QR Scans', icon: '📱', color: '#7e22ce' },
  { key: 'product_click', label: 'Product Views', icon: '🛍️', color: '#ca8a04' },
  { key: 'save_contact', label: 'Contact Saves', icon: '💾', color: '#0891b2' },
];

const PLAN_COLORS = {
  basic: { bg: '#dcfce7', text: '#166534' },
  business: { bg: '#dbeafe', text: '#1d4ed8' },
  premium: { bg: '#fef3c7', text: '#b45309' },
  pro: { bg: '#f3e8ff', text: '#7e22ce' },
};

function PlanBadge({ plan }) {
  const c = PLAN_COLORS[plan] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: c.bg, color: c.text, textTransform: 'capitalize' }}>
      {plan || '—'}
    </span>
  );
}

export default function PerformanceClient() {
  const router = useRouter();
  const [range, setRange] = useState('28d');
  const [rows, setRows] = useState([]);
  const [overall, setOverall] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPerformance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/performance?range=${range}`);
      if (!res.ok) { setError('Failed to load performance data.'); setLoading(false); return; }
      const data = await res.json();
      setRows(data.rows || []);
      setOverall(data.overall || {});
    } catch (e) {
      setError('Failed to load performance data.');
    }
    setLoading(false);
  }, [range]);

  useEffect(() => { fetchPerformance(); }, [fetchPerformance]);

  const maxViews = Math.max(1, ...rows.map(r => r.views));

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: 0 }}>Performance</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              style={{
                padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: range === r.key ? '1.5px solid #005DFF' : '1.5px solid #e2e8f0',
                background: range === r.key ? '#eff6ff' : 'white',
                color: range === r.key ? '#005DFF' : '#475569',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 20px' }}>
        Businesses ranked by profile views — see who's performing well and who might need a nudge.
      </p>

      {/* Platform-wide totals for the selected range */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 24 }}>
        {OVERALL_CARDS.map(c => (
          <div key={c.key} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: c.color }}>{overall[c.key] || 0}</div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>Leaderboard</div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      {!loading && rows.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8', background: 'white', borderRadius: 12, border: '1px solid #f1f5f9' }}>
          No activity recorded in this range yet.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
        ) : (
          rows.map((r, i) => (
            <div
              key={r.id}
              onClick={() => router.push(`/admin/performance/${r.id}`)}
              style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div style={{ fontSize: 14, fontWeight: 800, color: i < 3 ? '#005DFF' : '#cbd5e1', width: 28, flexShrink: 0 }}>#{i + 1}</div>

              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{r.business_name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span>{r.city || '—'}</span>
                  <PlanBadge plan={r.plan} />
                  {!r.is_active && <span style={{ color: '#dc2626', fontWeight: 700 }}>Inactive</span>}
                </div>
              </div>

              <div style={{ flex: 2, minWidth: 120 }}>
                <div style={{ height: 8, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(r.views / maxViews) * 100}%`, background: '#005DFF', borderRadius: 999 }} />
                </div>
              </div>

              <div style={{ textAlign: 'right', width: 70, flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#005DFF' }}>{r.views}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>views</div>
              </div>

              <div style={{ textAlign: 'right', width: 90, flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#166534' }}>{r.engagement}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>clicks/actions</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}