'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const PLAN_OPTIONS = ['basic', 'business', 'premium', 'pro'];
const STATUS_OPTIONS = ['approved', 'pending', 'rejected'];

const PLAN_COLORS = {
  basic: { bg: '#dcfce7', text: '#166534' },
  business: { bg: '#dbeafe', text: '#1d4ed8' },
  premium: { bg: '#fef3c7', text: '#b45309' },
  pro: { bg: '#f3e8ff', text: '#7e22ce' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function PlanBadge({ plan }) {
  const c = PLAN_COLORS[plan] || { bg: '#f1f5f9', text: '#475569' };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: c.bg, color: c.text, textTransform: 'capitalize' }}>
      {plan || '—'}
    </span>
  );
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      style={{
        width: 38, height: 22, borderRadius: 999, border: 'none', position: 'relative', cursor: disabled ? 'default' : 'pointer',
        background: checked ? '#005DFF' : '#e2e8f0', transition: 'background 0.15s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: '50%',
        background: 'white', transition: 'left 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function toCsv(rows) {
  const headers = ['Business Name', 'Username', 'City', 'Category', 'Plan', 'Status', 'Active', 'Verified', 'Featured', 'Amount Paid', 'Created'];
  const lines = [headers.join(',')];
  rows.forEach(r => {
    const line = [
      r.business_name || r.full_name || '',
      r.username || '',
      r.city || '',
      r.category || '',
      r.plan || '',
      r.status || '',
      r.is_active ? 'Yes' : 'No',
      r.is_verified ? 'Yes' : 'No',
      r.is_featured ? 'Yes' : 'No',
      r.amount_paid || 0,
      formatDate(r.created_at),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`);
    lines.push(line.join(','));
  });
  return lines.join('\n');
}

export default function BusinessProfilesClient() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [plan, setPlan] = useState('');
  const [status, setStatus] = useState('');
  const [verified, setVerified] = useState('');
  const [active, setActive] = useState('');
  const [page, setPage] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, plan, status, verified, active]);

  const buildParams = useCallback((forExport) => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (plan) params.set('plan', plan);
    if (status) params.set('status', status);
    if (verified) params.set('verified', verified);
    if (active) params.set('active', active);
    if (forExport) params.set('export', '1');
    else params.set('page', String(page));
    return params;
  }, [debouncedSearch, plan, status, verified, active, page]);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/business-profiles?${buildParams(false).toString()}`);
      if (!res.ok) { setError('Failed to load profiles.'); setLoading(false); return; }
      const data = await res.json();
      setProfiles(data.profiles || []);
      setTotal(data.total || 0);
      setPageSize(data.pageSize || 25);
    } catch (e) {
      setError('Failed to load profiles.');
    }
    setLoading(false);
  }, [buildParams]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  async function handleToggle(profileRow, field) {
    setToggling(`${profileRow.id}-${field}`);
    const newValue = !profileRow[field];
    try {
      const res = await fetch('/api/admin/business-profiles/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profileRow.id, field, value: newValue }),
      });
      if (res.ok) {
        setProfiles(prev => prev.map(p => p.id === profileRow.id ? { ...p, [field]: newValue } : p));
      }
    } catch (e) { /* silently ignore, admin can retry */ }
    setToggling(null);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/business-profiles?${buildParams(true).toString()}`);
      if (res.ok) {
        const data = await res.json();
        const csv = toCsv(data.profiles || []);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `smartprofile-businesses-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) { /* ignore */ }
    setExporting(false);
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectStyle = { padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, background: 'white' };

  return (
    <div style={{ padding: 24, maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#001144', margin: 0 }}>Business Profiles</h1>
        <button
          onClick={handleExport}
          disabled={exporting || total === 0}
          style={{ padding: '10px 18px', background: (exporting || total === 0) ? '#cbd5e1' : '#005DFF', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: (exporting || total === 0) ? 'default' : 'pointer' }}
        >
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, username, city, category..."
          style={{ flex: '1 1 260px', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }}
        />
        <select value={plan} onChange={e => setPlan(e.target.value)} style={selectStyle}>
          <option value="">All Plans</option>
          {PLAN_OPTIONS.map(p => <option key={p} value={p} style={{ textTransform: 'capitalize' }}>{p}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
        </select>
        <select value={verified} onChange={e => setVerified(e.target.value)} style={selectStyle}>
          <option value="">Verified: All</option>
          <option value="yes">Verified only</option>
          <option value="no">Not verified</option>
        </select>
        <select value={active} onChange={e => setActive(e.target.value)} style={selectStyle}>
          <option value="">Active: All</option>
          <option value="yes">Active only</option>
          <option value="no">Inactive only</option>
        </select>
      </div>

      {error && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>
        {loading ? 'Loading...' : `${total} business${total === 1 ? '' : 'es'} found`}
      </div>

      <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Business</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>City / Category</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Plan</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Verified</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569', textAlign: 'center' }}>Featured</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : profiles.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>No businesses match your filters.</td></tr>
              ) : (
                profiles.map(p => (
                  <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => router.push(`/admin/edit/${p.id}`)}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#005DFF', fontWeight: 700, cursor: 'pointer', fontSize: 13, textDecoration: 'underline', display: 'block' }}
                      >
                        {p.business_name || p.full_name || p.username}
                      </button>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>@{p.username}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{p.city || '—'}{p.category ? ` · ${p.category}` : ''}</td>
                    <td style={{ padding: '12px 16px' }}><PlanBadge plan={p.plan} /></td>
                    <td style={{ padding: '12px 16px', color: '#334155', textTransform: 'capitalize' }}>{p.status || '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Toggle checked={p.is_verified} disabled={toggling === `${p.id}-is_verified`} onChange={() => handleToggle(p, 'is_verified')} />
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Toggle checked={p.is_featured} disabled={toggling === `${p.id}-is_featured`} onChange={() => handleToggle(p, 'is_featured')} />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(p.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: page === 1 ? '#f8fafc' : 'white', color: page === 1 ? '#cbd5e1' : '#334155', fontSize: 13, fontWeight: 600, cursor: page === 1 ? 'default' : 'pointer' }}>
            ← Previous
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: page === totalPages ? '#f8fafc' : 'white', color: page === totalPages ? '#cbd5e1' : '#334155', fontSize: 13, fontWeight: 600, cursor: page === totalPages ? 'default' : 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}