'use client';
import { useState, useEffect, useCallback } from 'react';

export default function QrManagementClient() {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [qrCache, setQrCache] = useState({}); // username -> data URL
  const [loadingQr, setLoadingQr] = useState(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    const res = await fetch(`/api/admin/qr-list?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setProfiles(data.profiles || []);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProfiles, 300);
    return () => clearTimeout(t);
  }, [fetchProfiles]);

  async function loadQr(username) {
    if (qrCache[username]) return;
    setLoadingQr(username);
    try {
      const res = await fetch(`/api/qr?username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        setQrCache(prev => ({ ...prev, [username]: data.qr }));
      }
    } catch (e) { /* ignore, user can retry */ }
    setLoadingQr(null);
  }

  function downloadQr(username, dataUrl) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `smartprofile-qr-${username}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: '0 0 8px' }}>QR Management</h1>
      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
        Every business gets a QR code linking to their Digital Card, generated on demand — nothing to store or manage per business.
      </p>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search business name or username..."
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, marginBottom: 16 }}
      />

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${profiles.length} business${profiles.length === 1 ? '' : 'es'}`}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {profiles.map(p => (
          <div key={p.id} style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, marginBottom: 2 }}>{p.business_name || p.full_name || p.username}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>{p.city || '—'} · {p.plan || 'basic'}</div>

            {qrCache[p.username] ? (
              <>
                <img src={qrCache[p.username]} alt={`QR for ${p.username}`} style={{ width: '100%', borderRadius: 8, marginBottom: 10 }} />
                <button
                  onClick={() => downloadQr(p.username, qrCache[p.username])}
                  style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: 'none', background: '#005DFF', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Download
                </button>
              </>
            ) : (
              <button
                onClick={() => loadQr(p.username)}
                disabled={loadingQr === p.username}
                style={{ width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#334155', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                {loadingQr === p.username ? 'Loading...' : 'View QR Code'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}