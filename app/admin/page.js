'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

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
      setIsAdmin(true);
      setChecking(false);
    }
    checkAdmin();
  }, [session, status, router]);

  useEffect(() => {
    if (isAdmin) fetchProfiles();
  }, [isAdmin, filter]);

  async function fetchProfiles() {
    setLoading(true);
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data, error } = await query;
    if (!error) setProfiles(data || []);
    setLoading(false);
  }

  async function handleAction(profileId, action) {
    setActionLoading(profileId);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId }),
      });
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== profileId));
      } else {
        alert('Action failed. Try again.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setActionLoading(null);
  }

  if (checking) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Checking access...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          Admin — Profile Approvals
        </h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          Review and approve business profiles before they go live.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                background: filter === f ? '#3b82f6' : '#e2e8f0',
                color: filter === f ? 'white' : '#475569',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading profiles...</p>
        ) : profiles.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94a3b8' }}>
            No {filter !== 'all' ? filter : ''} profiles found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {profiles.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      {p.logo_url && (
                        <img src={p.logo_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      )}
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                          {p.business_name || p.full_name || 'Unnamed'}
                        </h3>
                        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                          smartprofile.in/{p.username}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 6, fontSize: 13, color: '#475569' }}>
                      <p style={{ margin: 0 }}><strong>Plan:</strong> {p.plan || '-'}</p>
                      <p style={{ margin: 0 }}><strong>Category:</strong> {p.category || p.business_type || '-'}</p>
                      <p style={{ margin: 0 }}><strong>Phone:</strong> {p.phone || '-'}</p>
                      <p style={{ margin: 0 }}><strong>Email:</strong> {p.email || '-'}</p>
                      <p style={{ margin: 0 }}><strong>City:</strong> {p.city || '-'}, {p.state || '-'}</p>
                      <p style={{ margin: 0 }}>
                        <strong>Status:</strong>{' '}
                        <span style={{
                          padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: p.status === 'approved' ? '#dcfce7' : p.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                          color: p.status === 'approved' ? '#16a34a' : p.status === 'rejected' ? '#dc2626' : '#ca8a04',
                        }}>
                          {p.status || 'pending'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/${p.username}`} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '8px 14px', borderRadius: 8, background: '#e2e8f0', color: '#334155', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                      View
                    </a>
                    <a href={`/admin/edit/${p.id}`}
                      style={{ padding: '8px 14px', borderRadius: 8, background: '#dbeafe', color: '#1d4ed8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                      Edit
                    </a>
                    {p.status !== 'approved' && (
                      <button
                        onClick={() => handleAction(p.id, 'approve')}
                        disabled={actionLoading === p.id}
                        style={{ padding: '8px 14px', borderRadius: 8, background: '#3b82f6', color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        {actionLoading === p.id ? '...' : 'Approve'}
                      </button>
                    )}
                    {p.status !== 'rejected' && (
                      <button
                        onClick={() => handleAction(p.id, 'reject')}
                        disabled={actionLoading === p.id}
                        style={{ padding: '8px 14px', borderRadius: 8, background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        {actionLoading === p.id ? '...' : 'Reject'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}