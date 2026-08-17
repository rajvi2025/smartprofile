'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CARDS = [
  { key: 'view', label: 'Profile Views', icon: '👁️', color: '#005DFF' },
  { key: 'qr_scan', label: 'QR Scans', icon: '📱', color: '#7e22ce' },
  { key: 'whatsapp_click', label: 'WhatsApp Clicks', icon: '💬', color: '#166534' },
  { key: 'call_click', label: 'Call Clicks', icon: '📞', color: '#b45309' },
];

function formatDay(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [summary, setSummary] = useState({ view: 0, qr_scan: 0, whatsapp_click: 0, call_click: 0 });
  const [daily, setDaily] = useState([]);
  const [hasProfile, setHasProfile] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.email) {
      router.push('/login');
      return;
    }
    fetchAnalytics();
  }, [session, status]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/analytics');
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary || { view: 0, qr_scan: 0, whatsapp_click: 0, call_click: 0 });
        setDaily(data.daily || []);
        setHasProfile(data.hasProfile !== false);
      }
    } catch (e) { /* ignore, shows empty state */ }
    setLoading(false);
  }

  const maxDaily = Math.max(1, ...daily.map(d => d.count));

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading...</div>;
  }

  if (!hasProfile) {
    return (
      <div style={{ padding: 40, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#001144', marginBottom: 8 }}>No profile yet</h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>Create your business profile first to start tracking views, QR scans, and clicks.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: '0 0 4px' }}>Analytics</h1>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>Last 30 days of activity on your profile.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        {CARDS.map(c => (
          <div key={c.key} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{summary[c.key]}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>Daily Activity</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
          {daily.map(d => (
            <div key={d.date} title={`${formatDay(d.date)}: ${d.count}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{
                width: '100%', maxWidth: 14, borderRadius: '3px 3px 0 0',
                background: d.count > 0 ? '#005DFF' : '#f1f5f9',
                height: `${Math.max(3, (d.count / maxDaily) * 100)}%`,
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 8 }}>
          <span>{daily[0] ? formatDay(daily[0].date) : ''}</span>
          <span>{daily[daily.length - 1] ? formatDay(daily[daily.length - 1].date) : ''}</span>
        </div>
      </div>
    </div>
  );
}