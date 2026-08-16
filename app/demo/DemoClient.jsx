'use client';
import Link from 'next/link';

const demoProfiles = [
  { name: 'COPPERKING', role: 'Copper Exporter', location: 'Thane, Maharashtra', price: '999', color1: '#f59e0b', color2: '#d97706', username: 'copperking' },
  { name: 'Image Graphics', role: 'Designing & Printing', location: 'Thane, Maharashtra', price: '599', color1: '#3b82f6', color2: '#6366f1', username: 'image-graphics' },
  { name: 'Om Sai Fire Solutions', role: 'Fire Fighting & Alarm Systems', location: 'Mumbai, Maharashtra', price: '399', color1: '#ef4444', color2: '#dc2626', username: 'om-sai-fire-solutions' },
  { name: 'Carnival Celebration', role: 'Banquet Hall / Event Venue', location: 'Mira Road, Maharashtra', price: '199', color1: '#6366f1', color2: '#4f46e5', username: 'carnival-celebration' },
];

// Real device viewport we render the live page at, then scale down to fit the phone frame.
const DEVICE_W = 390;
const DEVICE_H = 780;
const FRAME_W = 200;
const SCALE = FRAME_W / DEVICE_W;
const FRAME_H = Math.round(DEVICE_H * SCALE);

export default function DemoClient() {
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 20, justifyItems: 'center', maxWidth: 1000, margin: '0 auto' }}>
            {demoProfiles.map((p, i) => (
              <Link key={i} href={`/${p.username}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Phone frame */}
                <div style={{ background: '#0a0f1e', borderRadius: 34, padding: 9, boxShadow: '0 20px 50px rgba(0,0,0,0.18)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 70, height: 16, background: '#0a0f1e', borderRadius: 10, zIndex: 2 }} />
                  <div style={{ width: FRAME_W, height: FRAME_H, borderRadius: 24, overflow: 'hidden', position: 'relative', background: '#fff' }}>
                    <iframe
                      src={`/${p.username}`}
                      title={p.name}
                      style={{
                        width: DEVICE_W,
                        height: DEVICE_H,
                        border: 'none',
                        transform: `scale(${SCALE})`,
                        transformOrigin: 'top left',
                        pointerEvents: 'none',
                      }}
                      loading="lazy"
                      tabIndex={-1}
                    />
                  </div>
                </div>
                {/* Info below phone */}
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, borderRadius: 20, padding: '3px 12px', fontSize: 11, color: '#fff', fontWeight: 800, marginBottom: 8 }}>
                    ₹{p.price}/yr
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{p.role}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {p.location}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 52 }}>
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