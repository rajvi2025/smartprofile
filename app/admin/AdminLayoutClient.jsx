'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// BUILT items are real, working pages. Add a new one here the day its page actually exists.
// `key` must match the permission keys used in the Staff page / staff_permissions table.
// `adminOnly: true` means staff can never see or access this section, no matter their permissions.
const BUILT_ITEMS = [
  { key: 'approvals', href: '/admin', label: 'Dashboard', icon: '📊' },
  { key: 'coupons', href: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
  { key: 'staff', href: '/admin/staff', label: 'Staff', icon: '🧑\u200d💼', adminOnly: true },
];

// COMING_SOON items are shown to admin only, purely so the full vision stays visible —
// they're greyed out and unclickable until each one actually gets built. Move an entry
// up into BUILT_ITEMS (with a real href) the day it ships.
const COMING_SOON_ITEMS = [
  { section: 'Business' },
  { label: 'Users', icon: '👥' },
  { label: 'Business Profiles', icon: '🏢' },
  { label: 'Directory', icon: '📁' },
  { label: 'Plans & Pricing', icon: '💳' },
  { label: 'Payments', icon: '💰' },
  { label: 'QR Management', icon: '📱' },
  { label: 'NFC Management', icon: '📶' },
  { label: 'Leads (CRM)', icon: '🎯' },
  { label: 'Reviews', icon: '⭐' },
  { section: 'Marketing' },
  { label: 'Email Center', icon: '✉️' },
  { label: 'WhatsApp Center', icon: '💬' },
  { label: 'Advertisements', icon: '📢' },
  { section: 'Platform' },
  { label: 'CMS', icon: '📝' },
  { label: 'Reports & Analytics', icon: '📈' },
  { label: 'AI Center', icon: '🤖' },
  { label: 'Support System', icon: '🎧' },
  { section: 'System' },
  { label: 'Integrations', icon: '🔌' },
  { label: 'Security', icon: '🛡️' },
  { label: 'Settings', icon: '⚙️' },
  { label: 'System Logs', icon: '🗂️' },
];

function keyForPath(pathname) {
  if (pathname.startsWith('/admin/staff')) return 'staff';
  if (pathname.startsWith('/admin/coupons')) return 'coupons';
  if (pathname.startsWith('/admin/edit')) return 'approvals';
  if (pathname === '/admin') return 'approvals';
  return null;
}

export default function AdminLayoutClient({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [role, setRole] = useState(null); // 'admin' | 'staff'
  const [permissions, setPermissions] = useState([]);
  const [accessDenied, setAccessDenied] = useState(null);

  useEffect(() => {
    async function checkAccess() {
      if (status === 'loading') return;
      if (!session?.user?.email) {
        router.push('/login');
        return;
      }

      const { data: userRow, error } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', session.user.email)
        .single();

      if (error || !userRow || (userRow.role !== 'admin' && userRow.role !== 'staff')) {
        router.push('/');
        return;
      }

      if (userRow.role === 'admin') {
        setRole('admin');
        setChecking(false);
        return;
      }

      const { data: perm } = await supabase
        .from('staff_permissions')
        .select('*')
        .eq('user_id', userRow.id)
        .single();

      if (!perm || !perm.is_active) {
        setAccessDenied('Your staff access has been deactivated. Contact the admin.');
        setChecking(false);
        return;
      }
      if (perm.valid_until && new Date(perm.valid_until) < new Date()) {
        setAccessDenied('Your staff access has expired. Contact the admin.');
        setChecking(false);
        return;
      }
      if (perm.allowed_ip) {
        try {
          const ipRes = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipRes.json();
          const allowedList = perm.allowed_ip.split(',').map(ip => ip.trim());
          if (!allowedList.includes(ipData.ip)) {
            setAccessDenied('Access is restricted to a different network for your account. Contact the admin.');
            setChecking(false);
            return;
          }
        } catch (e) { /* IP check failure shouldn't lock staff out */ }
      }

      setRole('staff');
      setPermissions(perm.permissions || []);
      setChecking(false);
    }
    checkAccess();
  }, [session, status, router]);

  useEffect(() => {
    if (checking || role !== 'staff') return;
    const requiredKey = keyForPath(pathname);
    const navItem = BUILT_ITEMS.find(n => n.key === requiredKey);
    const blocked = !requiredKey || navItem?.adminOnly || !permissions.includes(requiredKey);
    if (blocked) {
      const firstAllowed = BUILT_ITEMS.find(n => !n.adminOnly && permissions.includes(n.key));
      if (firstAllowed) {
        router.replace(firstAllowed.href);
      } else {
        setAccessDenied('You do not have access to any section yet. Contact the admin.');
      }
    }
  }, [pathname, checking, role, permissions, router]);

  if (checking) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Checking access...</div>;
  }

  if (accessDenied) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔒</p>
          <p style={{ color: '#334155', fontWeight: 600 }}>{accessDenied}</p>
        </div>
      </div>
    );
  }

  const visibleBuiltItems = BUILT_ITEMS.filter(item => {
    if (role === 'admin') return true;
    if (item.adminOnly) return false;
    return permissions.includes(item.key);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 250, flexShrink: 0, background: '#0f172a', minHeight: '100vh',
        position: 'sticky', top: 0, alignSelf: 'flex-start', padding: '20px 0',
        display: 'flex', flexDirection: 'column', maxHeight: '100vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 18px', borderBottom: '1px solid #1e293b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>SP</div>
          <div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white' }}>Smart<span style={{ color: '#60a5fa' }}>Profile</span></div>
            </a>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{role === 'admin' ? 'Master Admin' : 'Staff Panel'}</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '6px 10px' }}>
          {visibleBuiltItems.map(item => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 13.5, fontWeight: active ? 700 : 500, marginBottom: 2,
                  background: active ? '#1e40af' : 'transparent',
                  color: active ? 'white' : '#cbd5e1',
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            );
          })}

          {role === 'admin' && (
            <>
              {COMING_SOON_ITEMS.map((item, i) => item.section ? (
                <div key={`sec-${i}`} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: '#475569', padding: '14px 10px 6px', textTransform: 'uppercase' }}>
                  {item.section}
                </div>
              ) : (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
                  fontSize: 13.5, fontWeight: 500, color: '#475569', marginBottom: 2, cursor: 'default',
                }}>
                  <span style={{ opacity: 0.6 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#64748b', background: '#1e293b', padding: '2px 6px', borderRadius: 999 }}>SOON</span>
                </div>
              ))}
            </>
          )}
        </nav>

        <div style={{ padding: '16px 20px 0', borderTop: '1px solid #1e293b' }}>
          {session?.user?.email && (
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px', wordBreak: 'break-all' }}>
              👤 {session.user.email}
            </p>
          )}
          <a href="/dashboard" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}>← Back to Site</a>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}