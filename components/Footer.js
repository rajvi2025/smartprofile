'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const RESERVED_TOP_LEVEL = [
  '', 'admin', 'api', 'contact', 'dashboard', 'directory', 'free-listing',
  'login', 'privacy', 'refund', 'register', 'shipping', 'terms', 'blog', 'pricing',
];

function isDigitalCardRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return false;
  if (RESERVED_TOP_LEVEL.includes(parts[0])) return false;
  if (parts.length === 1) return true;
  if (parts.length === 2 && parts[1] === 'review') return true;
  return false;
}

export default function Footer() {
  const pathname = usePathname();
  if (isDigitalCardRoute(pathname)) return null;

  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '60px 24px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Top Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          
          {/* Brand */}
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
              <span style={{ color: 'white' }}>Smart</span><span style={{ color: '#3b82f6' }}>Profile</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20, color: '#64748b' }}>
              One Profile. Complete Business.<br />India ka #1 digital business profile platform.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: 'https://www.facebook.com/smartprofilein/', label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { href: 'https://www.instagram.com/smartprofile.in', label: 'Instagram', path: 'M16 2H8a6 6 0 00-6 6v8a6 6 0 006 6h8a6 6 0 006-6V8a6 6 0 00-6-6zm-4 13a5 5 0 110-10 5 5 0 010 10zm5-9a1 1 0 110-2 1 1 0 010 2z' },
                { href: 'https://x.com/samartprofile', label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { href: 'https://www.youtube.com/@smartprofilein', label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3b82f6'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Product</h4>
            {[['Features', '/'], ['Directory', '/directory'], ['NFC Cards', '/'], ['Pricing', '/#pricing'], ['How it Works', '/']].map(([label, href]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <Link href={href} style={{ color: '#64748b', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Company</h4>
            {[['Contact Us', '/contact'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/refund'], ['Shipping Policy', '/shipping']].map(([label, href]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <Link href={href} style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Contact</h4>
            {[
              ['📧', 'info@smartprofile.in'],
              ['📞', '9987029548'],
              ['📍', 'Mira Road, Thane'],
              ['🌏', 'Maharashtra, India'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 10, fontSize: 14, color: '#64748b' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>© 2026 SmartProfile.in. All rights reserved.</p>
          <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
            Made with <span style={{ color: '#ef4444' }}>❤️</span> in India
          </p>
        </div>

      </div>
    </footer>
  );
}