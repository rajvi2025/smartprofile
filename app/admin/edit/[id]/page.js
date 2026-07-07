'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const FIELDS = [
  ['business_name', 'Business Name'],
  ['full_name', 'Full Name'],
  ['tagline', 'Tagline'],
  ['designation', 'Designation'],
  ['category', 'Category'],
  ['business_type', 'Business Type'],
  ['plan', 'Plan'],
  ['username', 'Username (URL slug)'],
  ['phone', 'Phone'],
  ['whatsapp', 'WhatsApp'],
  ['email', 'Email'],
  ['website', 'Website'],
  ['address', 'Address'],
  ['city', 'City'],
  ['state', 'State'],
  ['logo_url', 'Logo URL'],
  ['banner_url', 'Banner URL'],
  ['maps_url', 'Maps URL'],
  ['video_url', 'Video URL'],
  ['brochure_url', 'Brochure URL'],
  ['theme', 'Theme'],
];

const TEXTAREA_FIELDS = [
  ['about', 'About'],
  ['bio', 'Bio'],
];

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const profileId = params.id;

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function checkAdmin() {
      if (status === 'loading') return;
      if (!session?.user?.email) {
        router.push('/login');
        return;
      }
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.user.email)
        .single();

      if (error || data?.role !== 'admin') {
        router.push('/');
        return;
      }
      setChecking(false);
    }
    checkAdmin();
  }, [session, status, router]);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      if (!error && data) setForm(data);
      setLoading(false);
    }
    if (!checking) fetchProfile();
  }, [checking, profileId]);

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, updates: form }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Saved successfully.');
      } else {
        setMessage('Error: ' + (data.error || 'Failed to save'));
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setSaving(false);
  }

  if (checking || loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <button
          onClick={() => router.push('/admin')}
          style={{ marginBottom: 16, background: 'none', border: 'none', color: '#3b82f6', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Back to Admin
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
          Edit Profile
        </h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          smartprofile.in/{form.username}
        </p>

        {message && (
          <div style={{
            padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 600,
            background: message.startsWith('Error') ? '#fee2e2' : '#dcfce7',
            color: message.startsWith('Error') ? '#dc2626' : '#16a34a',
          }}>
            {message}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FIELDS.map(([key, label]) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }}
                />
              </div>
            ))}
          </div>

          {TEXTAREA_FIELDS.map(([key, label]) => (
            <div key={key} style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                {label}
              </label>
              <textarea
                value={form[key] || ''}
                onChange={e => handleChange(key, e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, resize: 'vertical' }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#334155' }}>
              <input
                type="checkbox"
                checked={!!form.is_verified}
                onChange={e => handleChange('is_verified', e.target.checked)}
              />
              Verified Badge
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#334155' }}>
              <input
                type="checkbox"
                checked={!!form.is_active}
                onChange={e => handleChange('is_active', e.target.checked)}
              />
              Active (Live)
            </label>
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
              Status
            </label>
            <select
              value={form.status || 'pending'}
              onChange={e => handleChange('status', e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14 }}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: 24, padding: '12px 24px', borderRadius: 8, background: '#3b82f6',
              color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}