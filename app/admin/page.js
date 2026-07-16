'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const PLAN_LABELS = { basic: 'Basic', business: 'Business', premium: 'Premium', pro: 'Pro' };
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
    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: c.bg, color: c.text }}>
      {PLAN_LABELS[plan] || plan || '—'}
    </span>
  );
}

export default function AdminDashboard() {
  // Dashboard overview state
  const [stats, setStats] = useState({ total: 0, pending: 0, activeCoupons: 0, monthRevenue: 0, stuckPayments: 0 });
  const [topPlans, setTopPlans] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [dashLoading, setDashLoading] = useState(true);

  // Profile approvals state (existing workflow, kept on this page)
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [filter]);

  async function fetchDashboardData() {
    setDashLoading(true);

    const { count: total } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    const { count: pending } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'pending');

    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('business_name, full_name, plan, amount_paid, city, created_at, plan_start_date, plan_end_date');

    // Revenue and active-coupon count come from a secure server-side route
    // (payments/coupons tables are not publicly readable via the anon key).
    const statsRes = await fetch('/api/admin/dashboard-stats');
    const statsData = statsRes.ok ? await statsRes.json() : { activeCoupons: 0, monthRevenue: 0, stuckPayments: 0 };
    const { activeCoupons, monthRevenue, stuckPayments } = statsData;

    setStats({ total: total || 0, pending: pending || 0, activeCoupons: activeCoupons || 0, monthRevenue, stuckPayments: stuckPayments || 0 });

    // Top plans by revenue — aggregated client-side from the same fetch above.
    const planMap = {};
    (allProfiles || []).forEach(p => {
      const key = p.plan || 'basic';
      if (!planMap[key]) planMap[key] = { plan: key, users: 0, revenue: 0 };
      planMap[key].users += 1;
      planMap[key].revenue += Number(p.amount_paid) || 0;
    });
    setTopPlans(Object.values(planMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

    // Recent signups
    const recent = [...(allProfiles || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
    setRecentSignups(recent);

    // Expiring soon — has a plan_end_date in the future, soonest first
    const now = new Date();
    const expiring = (allProfiles || [])
      .filter(p => p.plan_end_date && new Date(p.plan_end_date) > now)
      .sort((a, b) => new Date(a.plan_end_date) - new Date(b.plan_end_date))
      .slice(0, 5);
    setExpiringSoon(expiring);

    setDashLoading(false);
  }

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
        fetchDashboardData();
      } else {
        alert('Action failed. Try again.');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setActionLoading(null);
  }

  const panelStyle = { background: 'white', borderRadius: 14, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
  const thStyle = { textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: 11, paddingBottom: 8 };
  const tdStyle = { padding: '7px 0', borderTop: '1px solid #f1f5f9', fontSize: 12.5 };

  return (
    <div style={{ padding: '26px 28px' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>

        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Welcome back, Santosh! 👋</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Here's what's happening with your platform today.</p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Total Profiles', value: dashLoading ? '—' : stats.total, icon: '👥', bg: '#eff6ff' },
            { label: 'Pending Approvals', value: dashLoading ? '—' : stats.pending, icon: '⏳', bg: '#fef3c7' },
            { label: 'Active Coupons', value: dashLoading ? '—' : stats.activeCoupons, icon: '🏷️', bg: '#f0fdf4' },
            { label: 'This Month Revenue', value: dashLoading ? '—' : `₹${stats.monthRevenue.toLocaleString('en-IN')}`, icon: '💰', bg: '#f5f3ff' },
            {
              label: '⚠️ Stuck Payments', value: dashLoading ? '—' : stats.stuckPayments, icon: '💳',
              bg: !dashLoading && stats.stuckPayments > 0 ? '#fee2e2' : '#f8fafc',
              href: '/admin/payment-issues',
              alert: !dashLoading && stats.stuckPayments > 0,
            },
          ].map(s => {
            const card = (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{s.icon}</div>
                  <span style={{ fontSize: 12, color: s.alert ? '#dc2626' : '#64748b', fontWeight: 600 }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.alert ? '#dc2626' : '#0f172a' }}>{s.value}</div>
              </>
            );
            return s.href ? (
              <a key={s.label} href={s.href} style={{ ...panelStyle, textDecoration: 'none', display: 'block', border: s.alert ? '1px solid #fecaca' : panelStyle.border }}>{card}</a>
            ) : (
              <div key={s.label} style={panelStyle}>{card}</div>
            );
          })}
        </div>

        {/* Content grid: tables + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={panelStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>Top Plans by Revenue</h3>
              {dashLoading ? <p style={{ fontSize: 12, color: '#94a3b8' }}>Loading...</p> : topPlans.length === 0 ? (
                <p style={{ fontSize: 12, color: '#94a3b8' }}>No data yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr><th style={thStyle}>Plan</th><th style={thStyle}>Users</th><th style={thStyle}>Revenue</th></tr></thead>
                  <tbody>
                    {topPlans.map(p => (
                      <tr key={p.plan}>
                        <td style={tdStyle}><PlanBadge plan={p.plan} /></td>
                        <td style={tdStyle}>{p.users}</td>
                        <td style={tdStyle}>₹{p.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={panelStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>Recent Signups</h3>
              {dashLoading ? <p style={{ fontSize: 12, color: '#94a3b8' }}>Loading...</p> : recentSignups.length === 0 ? (
                <p style={{ fontSize: 12, color: '#94a3b8' }}>No signups yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr><th style={thStyle}>Business</th><th style={thStyle}>Plan</th><th style={thStyle}>City</th></tr></thead>
                  <tbody>
                    {recentSignups.map((p, i) => (
                      <tr key={i}>
                        <td style={tdStyle}>{p.business_name || p.full_name || '—'}</td>
                        <td style={tdStyle}><PlanBadge plan={p.plan} /></td>
                        <td style={tdStyle}>{p.city || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ ...panelStyle, gridColumn: '1 / -1' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>Expiring Soon</h3>
              {dashLoading ? <p style={{ fontSize: 12, color: '#94a3b8' }}>Loading...</p> : expiringSoon.length === 0 ? (
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Nothing expiring in the near term.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr><th style={thStyle}>Business</th><th style={thStyle}>Plan</th><th style={thStyle}>Expires</th></tr></thead>
                  <tbody>
                    {expiringSoon.map((p, i) => (
                      <tr key={i}>
                        <td style={tdStyle}>{p.business_name || p.full_name || '—'}</td>
                        <td style={tdStyle}><PlanBadge plan={p.plan} /></td>
                        <td style={tdStyle}>{formatDate(p.plan_end_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right sidebar: quick actions + status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={panelStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <a href="/admin/coupons" style={{ padding: '12px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, textAlign: 'center', background: '#eff6ff', color: '#1d4ed8', textDecoration: 'none' }}>🏷️ New Coupon</a>
                <a href="/admin/staff" style={{ padding: '12px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, textAlign: 'center', background: '#eef2ff', color: '#4338ca', textDecoration: 'none' }}>🧑‍💼 Add Staff</a>
                <div style={{ padding: '12px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, textAlign: 'center', background: '#f8fafc', color: '#94a3b8' }}>🏢 Add Business<br /><span style={{ fontSize: 9, fontWeight: 800 }}>SOON</span></div>
                <div style={{ padding: '12px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, textAlign: 'center', background: '#f8fafc', color: '#94a3b8' }}>📈 Reports<br /><span style={{ fontSize: 9, fontWeight: 800 }}>SOON</span></div>
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>System Status</h3>
              {[
                { label: 'Razorpay', value: 'Live Mode', ok: true },
                { label: 'Directory', value: 'Live', ok: true },
                { label: 'Coupon Engine', value: 'Active', ok: true },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 12.5, borderTop: '1px solid #f1f5f9' }}>
                  <span>{s.label}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontWeight: 700, fontSize: 11 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }}></span>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Existing Profile Approvals workflow */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Profile Approvals</h2>
          <p style={{ color: '#64748b', marginBottom: 16, fontSize: 13 }}>Review and approve business profiles before they go live.</p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['pending', 'approved', 'rejected', 'all'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  background: filter === f ? '#3b82f6' : '#e2e8f0', color: filter === f ? 'white' : '#475569', textTransform: 'capitalize',
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
                          <Image src={p.logo_url} alt="" width={40} height={40} style={{ borderRadius: 8, objectFit: 'cover' }} />
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
    </div>
  );
}