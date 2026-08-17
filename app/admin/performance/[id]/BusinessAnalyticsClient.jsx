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

const CARDS = [
  { key: 'view', label: 'Profile Views', icon: '👁️', color: '#005DFF' },
  { key: 'qr_scan', label: 'QR Scans', icon: '📱', color: '#7e22ce' },
  { key: 'whatsapp_click', label: 'WhatsApp Clicks', icon: '💬', color: '#166534' },
  { key: 'call_click', label: 'Call Clicks', icon: '📞', color: '#b45309' },
  { key: 'save_contact', label: 'Contact Saves', icon: '💾', color: '#0891b2' },
  { key: 'directions_click', label: 'Directions Clicks', icon: '📍', color: '#dc2626' },
  { key: 'product_click', label: 'Product Views', icon: '🛍️', color: '#ca8a04' },
  { key: 'email_click', label: 'Email Clicks', icon: '✉️', color: '#0284c7' },
  { key: 'website_click', label: 'Website Clicks', icon: '🌐', color: '#4338ca' },
  { key: 'share_click', label: 'Profile Shares', icon: '🔗', color: '#ea580c' },
  { key: 'social_click', label: 'Social Media Clicks', icon: '📸', color: '#c026d3' },
  { key: 'business_presence_click', label: 'Other Listing Clicks', icon: '🏬', color: '#65a30d' },
];

const SOURCE_LABELS = { google: '🔍 Google', whatsapp: '💬 WhatsApp', instagram: '📸 Instagram', facebook: '👍 Facebook', direct: '🔗 Direct', internal: '🏠 SmartProfile', other: '🌐 Other' };

function formatDay(dateStr) { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
function formatMonth(dateStr) { const [y, m] = dateStr.split('-'); return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); }

function BarRow({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#334155', marginBottom: 3 }}>
        <span>{label}</span><span style={{ fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export default function BusinessAnalyticsClient({ profileId }) {
  const router = useRouter();
  const [range, setRange] = useState('28d');
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState({});
  const [daily, setDaily] = useState([]);
  const [bucketBy, setBucketBy] = useState('day');
  const [visitors, setVisitors] = useState({ new: 0, returning: 0 });
  const [devices, setDevices] = useState({ mobile: 0, desktop: 0 });
  const [sources, setSources] = useState({});
  const [topCities, setTopCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/performance/${profileId}?range=${range}`);
    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile);
      setSummary(data.summary || {});
      setDaily(data.daily || []);
      setBucketBy(data.bucketBy || 'day');
      setVisitors(data.visitors || { new: 0, returning: 0 });
      setDevices(data.devices || { mobile: 0, desktop: 0 });
      setSources(data.sources || {});
      setTopCities(data.topCities || []);
    }
    setLoading(false);
  }, [profileId, range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const maxDaily = Math.max(1, ...daily.map(d => d.count));

  return (
    <div style={{ padding: 24, maxWidth: 950, margin: '0 auto' }}>
      <button onClick={() => router.push('/admin/performance')} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', marginBottom: 12, padding: 0 }}>
        ← Back to Performance
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: 0 }}>{profile?.business_name || 'Loading...'}</h1>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{profile?.city} {profile?.plan ? `· ${profile.plan}` : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {RANGES.map(r => (
            <button key={r.key} onClick={() => setRange(r.key)}
              style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: range === r.key ? '1.5px solid #005DFF' : '1.5px solid #e2e8f0', background: range === r.key ? '#eff6ff' : 'white', color: range === r.key ? '#005DFF' : '#475569' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, margin: '20px 0' }}>
        {CARDS.map(c => (
          <div key={c.key} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: c.color }}>{summary[c.key] || 0}</div>
            <div style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 2, lineHeight: 1.3 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 20 }}>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 10, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>NEW VS RETURNING</div>
          <BarRow label="New" value={visitors.new} total={visitors.new + visitors.returning} color="#005DFF" />
          <BarRow label="Returning" value={visitors.returning} total={visitors.new + visitors.returning} color="#7e22ce" />
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 10, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>DEVICE</div>
          <BarRow label="📱 Mobile" value={devices.mobile} total={devices.mobile + devices.desktop} color="#166534" />
          <BarRow label="💻 Desktop" value={devices.desktop} total={devices.mobile + devices.desktop} color="#b45309" />
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 10, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>TRAFFIC SOURCE</div>
          {Object.keys(sources).length === 0 ? <div style={{ fontSize: 11, color: '#cbd5e1' }}>No data yet</div> :
            Object.entries(sources).sort((a, b) => b[1] - a[1]).map(([src, count]) => (
              <BarRow key={src} label={SOURCE_LABELS[src] || src} value={count} total={Object.values(sources).reduce((a, b) => a + b, 0)} color="#0891b2" />
            ))}
        </div>
        <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 10, padding: 14, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>TOP CITIES</div>
          {topCities.length === 0 ? <div style={{ fontSize: 11, color: '#cbd5e1' }}>No data yet</div> :
            topCities.map(c => <BarRow key={c.city} label={c.city} value={c.count} total={topCities[0].count} color="#dc2626" />)}
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Daily Activity</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
          {daily.map(d => (
            <div key={d.date} title={`${bucketBy === 'month' ? formatMonth(d.date) : formatDay(d.date)}: ${d.count}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ width: '100%', maxWidth: 14, borderRadius: '3px 3px 0 0', background: d.count > 0 ? '#005DFF' : '#f1f5f9', height: `${Math.max(3, (d.count / maxDaily) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 8 }}>
          <span>{daily[0] ? (bucketBy === 'month' ? formatMonth(daily[0].date) : formatDay(daily[0].date)) : ''}</span>
          <span>{daily[daily.length - 1] ? (bucketBy === 'month' ? formatMonth(daily[daily.length - 1].date) : formatDay(daily[daily.length - 1].date)) : ''}</span>
        </div>
      </div>
    </div>
  );
}