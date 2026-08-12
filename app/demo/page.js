'use client';
import Link from 'next/link';

const demoProfiles = [
  { name: 'COPPERKING', role: 'Copper Exporter', location: 'Thane, Maharashtra', price: '999', avatar: 'CK', color1: '#f59e0b', color2: '#d97706', username: 'copperking' },
  { name: 'CKI Industries', role: 'Hotelware Supply', location: 'Thane, Maharashtra', price: '599', avatar: 'CI', color1: '#3b82f6', color2: '#6366f1', username: 'cki-industries' },
  { name: 'Om Sai Fire Solutions', role: 'Fire Fighting & Alarm Systems', location: 'Mumbai, Maharashtra', price: '399', avatar: 'OS', color1: '#ef4444', color2: '#dc2626', username: 'om-sai-fire-solutions' },
  { name: 'Carnival Celebration', role: 'Banquet Hall / Event Venue', location: 'Mira Road, Maharashtra', price: '199', avatar: 'CC', color1: '#6366f1', color2: '#4f46e5', username: 'carnival-celebration' },
];

export default function DemoPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#1e293b' }}>
      {/* HERO */}
      <section style={{ background: '#0f172a', padding: '56px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, padding: '6px 18px', fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 16 }}>See It Live</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Real Businesses, Real Profiles</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>See how SmartProfile looks for each plan — Basic, Business, Premium, and Pro. Tap any card to view the live profile.</p>
        </div>
      </section>

      {/* PROFILE GRID */}
      <section style={{ padding: '48px 24px 64px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {demoProfiles.map((p, i) => (
              <Link key={i} href={`/${p.username}`} style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', textDecoration: 'none', display: 'block' }}>
                <div style={{ height: 90, background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#fff', fontWeight: 800 }}>
                    ₹{p.price}/yr
                  </div>
                </div>
                <div style={{ padding: '0 20px 24px', marginTop: -32 }}>
                  <div style={{ width: 58, height: 58, borderRadius: '50%', background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, border: '3px solid #fff', marginBottom: 12, boxShadow: `0 4px 16px ${p.color1}40` }}>{p.avatar}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{p.role}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {p.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link href="/dashboard/create-profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '14px 36px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
              Create Your Own Profile
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}