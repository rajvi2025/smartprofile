'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Add new permission keys here as new admin sections get built.
const PERMISSION_OPTIONS = [
  { key: 'approvals', label: 'Profile Approvals' },
  { key: 'coupons', label: 'Coupons' },
  // { key: 'reports', label: 'Reports' }, // future
];

function emptyForm() {
  return {
    name: '', email: '', password: '',
    permissions: [],
    valid_until: '',
    allowed_ip: '',
  };
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    setLoading(true);
    const res = await fetch('/api/admin/staff-list');
    if (res.ok) {
      const data = await res.json();
      setStaff(data.staff || []);
    }
    setLoading(false);
  }

  function togglePermission(key) {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key],
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) return setFormError('Name is required.');
    if (!form.email.trim()) return setFormError('Email is required.');
    if (!form.password || form.password.length < 6) return setFormError('Password must be at least 6 characters.');
    if (form.permissions.length === 0) return setFormError('Select at least one permission.');

    setSaving(true);
    try {
      const res = await fetch('/api/admin/create-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          permissions: form.permissions,
          // Same IST-aware handling used for coupon dates — a date-only input is treated
          // as end-of-day India time, not UTC midnight.
          valid_until: form.valid_until ? new Date(`${form.valid_until}T23:59:59+05:30`).toISOString() : null,
          allowed_ip: form.allowed_ip.trim() || null,
          is_active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create staff account.');
        setSaving(false);
        return;
      }
      setForm(emptyForm());
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      setFormError('Something went wrong. Please try again.');
    }
    setSaving(false);
  }

  async function toggleActive(member) {
    if (!member.perm) return;
    setActionLoading(member.id);
    const res = await fetch('/api/admin/toggle-staff-permission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permId: member.perm.id, is_active: !member.perm.is_active }),
    });
    if (res.ok) {
      setStaff(prev => prev.map(s => s.id === member.id ? { ...s, perm: { ...s.perm, is_active: !s.perm.is_active } } : s));
    }
    setActionLoading(null);
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1',
    fontSize: 14, color: '#0f172a', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6, display: 'block' };

  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: 0 }}>Staff</h1>
            <p style={{ color: '#64748b', margin: '8px 0 0' }}>Create staff accounts and control what they can access.</p>
          </div>
          <button
            onClick={() => { setShowForm(s => !s); setFormError(''); }}
            style={{ padding: '10px 16px', borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : '+ Add Staff'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={{ background: 'white', borderRadius: 12, padding: 24, marginTop: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 0, marginBottom: 18 }}>Add New Staff</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" placeholder="e.g. Priya Sharma" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" placeholder="staff@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <input type="text" placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Valid Until (optional)</label>
                <input type="date" value={form.valid_until}
                  onChange={e => setForm({ ...form, valid_until: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Allowed IP Address (optional)</label>
                <input type="text" placeholder="e.g. 103.21.244.10" value={form.allowed_ip}
                  onChange={e => setForm({ ...form, allowed_ip: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <label style={labelStyle}>Permissions * (what this staff member can access)</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {PERMISSION_OPTIONS.map(opt => (
                  <label key={opt.key} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8,
                    border: form.permissions.includes(opt.key) ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                    background: form.permissions.includes(opt.key) ? '#eff6ff' : 'white',
                    fontSize: 13, fontWeight: 500, color: '#334155', cursor: 'pointer',
                  }}>
                    <input type="checkbox" checked={form.permissions.includes(opt.key)} onChange={() => togglePermission(opt.key)} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {formError && <p style={{ color: '#dc2626', fontSize: 13, fontWeight: 600, marginTop: 14 }}>{formError}</p>}

            <button type="submit" disabled={saving}
              style={{ marginTop: 20, padding: '10px 24px', borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              {saving ? 'Creating...' : 'Create Staff Account'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 28 }}>
          {loading ? (
            <p style={{ color: '#64748b' }}>Loading staff...</p>
          ) : staff.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              No staff accounts yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {staff.map(member => {
                const perm = member.perm;
                const isExpired = perm?.valid_until && new Date(perm.valid_until) < new Date();
                const active = perm?.is_active && !isExpired;
                return (
                  <div key={member.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{member.name}</span>
                          <span style={{
                            padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                            background: active ? '#dcfce7' : '#fee2e2',
                            color: active ? '#16a34a' : '#dc2626',
                          }}>
                            {!perm?.is_active ? 'Deactivated' : isExpired ? 'Expired' : 'Active'}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 6px', fontSize: 13, color: '#64748b' }}>{member.email}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                          {(perm?.permissions || []).map(p => (
                            <span key={p} style={{ fontSize: 11, fontWeight: 600, color: '#334155', background: '#f1f5f9', padding: '3px 9px', borderRadius: 999 }}>
                              {PERMISSION_OPTIONS.find(o => o.key === p)?.label || p}
                            </span>
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>
                          {perm?.valid_until ? `Valid until ${new Date(perm.valid_until).toLocaleDateString('en-IN')}` : 'No expiry'}
                          {perm?.allowed_ip ? ` · Restricted to IP: ${perm.allowed_ip}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleActive(member)}
                        disabled={actionLoading === member.id}
                        style={{
                          padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                          background: perm?.is_active ? '#fee2e2' : '#dcfce7',
                          color: perm?.is_active ? '#dc2626' : '#16a34a',
                        }}
                      >
                        {actionLoading === member.id ? '...' : perm?.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}