'use client';
import { useState } from 'react';
import Image from 'next/image';

const CARDS = [
  { id: 'black', name: 'Black Card', sub: 'Bold & Premium', img: 'https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/NFC/black-nfc-card.webp' },
  { id: 'gold', name: 'Gold Card', sub: 'Elite & Exclusive', img: 'https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/NFC/golden-nfc-card.webp' },
  { id: 'silver', name: 'Metallic Silver Card', sub: 'Premium & Sleek', img: 'https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/NFC/silver-nfc-card.webp' },
];

const PRICE = 599;

export default function NfcCardsClient() {
  const [selectedColor, setSelectedColor] = useState('black');
  const [form, setForm] = useState({ name: '', phone: '', email: '', business: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Name, phone number and delivery address are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/nfc-orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          business_name: form.business || null,
          delivery_address: form.address,
          notes: form.notes || null,
          card_color: selectedColor,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again or reach us on WhatsApp/Call.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#1e293b' }}>
      {/* NEW ANIMATED HERO */}
      <div className="anim-hero-wrap">
        <div className="header-wrap">

          <div className="header-text">
            <h1 className="headline">
              Tap. Connect.{" "}
              <span className="headline-accent">Grow.</span>
            </h1>
            <p className="subtext">
              Tap on any phone, your SmartProfile opens instantly.
              No app needed. Only <strong>₹599</strong> — with a{" "}
              <strong>free Premium Digital Card profile</strong> included.
            </p>
            <div className="cta-row">
              <button className="cta-primary">Order Your NFC Card</button>
              <button className="cta-secondary">See How It Works</button>
            </div>
          </div>

          <div className="visual-wrap">
            <div className="bg-ring bg-ring-1" />
            <div className="bg-ring bg-ring-2" />

            <div className="feature-float ff-1">
              <span className="ff-icon ff-icon-1">⚡</span>
              <span className="ff-text">
                <strong>Instant Sharing</strong>
                <small>Share your profile in just one tap.</small>
              </span>
            </div>
            <div className="feature-float ff-2">
              <span className="ff-icon ff-icon-2">📱</span>
              <span className="ff-text">
                <strong>No App Required</strong>
                <small>Works on any NFC enabled smartphone.</small>
              </span>
            </div>
            <div className="feature-float ff-3">
              <span className="ff-icon ff-icon-3">🔗</span>
              <span className="ff-text">
                <strong>All Links in One</strong>
                <small>Socials, services, payments &amp; more at one place.</small>
              </span>
            </div>

            <div className="header-visual">
              <div className="scene">

                <div className="nfc-card">
                  <img className="nfc-card-img" src="data:image/jpeg;base64,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" alt="CopperKing NFC Card" />
                </div>

                <div className="phone">
                  <div className="screen-frame">
                  <div className="phone-screen">

                    <div className="status-bar">
                      <span className="carrier">Airtel</span>
                      <span className="camera-dot" />
                      <div className="status-icons">
                        <svg width="15" height="10" viewBox="0 0 15 10" fill="none">
                          <rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="#fff"/>
                          <rect x="4" y="4" width="2.5" height="6" rx="0.5" fill="#fff"/>
                          <rect x="8" y="2" width="2.5" height="8" rx="0.5" fill="#fff"/>
                          <rect x="12" y="0" width="2.5" height="10" rx="0.5" fill="#fff" opacity="0.5"/>
                        </svg>
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                          <path d="M7 9.3c.5 0 .9-.4.9-.9s-.4-.9-.9-.9-.9.4-.9.9.4.9.9.9z" fill="#fff"/>
                          <path d="M4 6.2a4.2 4.2 0 0 1 6 0" stroke="#fff" strokeWidth="1.1" strokeLinecap="round"/>
                          <path d="M1.7 3.8a7.5 7.5 0 0 1 10.6 0" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
                        </svg>
                        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                          <rect x="0.5" y="0.5" width="18" height="9" rx="2.2" stroke="#fff" opacity="0.6"/>
                          <rect x="2" y="2" width="13" height="6" rx="1" fill="#fff"/>
                          <rect x="19" y="3" width="1.5" height="4" rx="0.7" fill="#fff" opacity="0.6"/>
                        </svg>
                      </div>
                    </div>

                    <div className="lock-screen">
                      <div className="lock-time">9:41</div>
                      <div className="lock-date">Thursday, 20 August</div>

                      <div className="lock-icons-row">
                        <span className="app-icon phone-app">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.9 21 3 12.1 3 1c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .7-.2 1L6.6 10.8z" fill="#fff"/>
                          </svg>
                        </span>
                        <span className="app-icon camera-app">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 3l-1.5 2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9z" fill="#fff"/>
                            <circle cx="12" cy="13" r="4" fill="#5a6b8c"/>
                          </svg>
                        </span>
                        <span className="app-icon whatsapp-app">
                          <svg width="22" height="22" viewBox="0 0 448 512" fill="none">
                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" fill="#25d366"/>
                          </svg>
                        </span>
                        <span className="app-icon message-app">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M4 4h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8l-4 3.5V18H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="#fff"/>
                            <circle cx="8" cy="10" r="1.2" fill="#4f6fe0"/>
                            <circle cx="12" cy="10" r="1.2" fill="#4f6fe0"/>
                            <circle cx="16" cy="10" r="1.2" fill="#4f6fe0"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className="profile-card">
                      <div className="banner">
                        <img src="https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/profiles/banners/d98c6772-d9e1-4328-9a9a-34b8fb8e1d12-1784007510440.png" alt="" />
                      </div>
                      <div className="logo-wrap">
                        <img className="logo" src="https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/profiles/logos/d98c6772-d9e1-4328-9a9a-34b8fb8e1d12-1783672579654.png" alt="" />
                      </div>
                      <div className="profile-body">
                        <div className="name">CopperKing Homee India Pvt Ltd</div>
                        <div className="role">Praveena Pawar</div>
                        <div className="role-title">Chief Business Officer</div>
                        <div className="location">Thane, Maharashtra</div>

                        <div className="btn-row">
                          <div className="icon-btn">
                            <span className="icon call">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.9 21 3 12.1 3 1c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .7-.2 1L6.6 10.8z" fill="#fff"/>
                              </svg>
                            </span>
                            <span className="icon-label">Call</span>
                          </div>
                          <div className="icon-btn">
                            <span className="icon whatsapp">
                              <svg width="17" height="17" viewBox="0 0 448 512" fill="none">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" fill="#fff"/>
                              </svg>
                            </span>
                            <span className="icon-label">WhatsApp</span>
                          </div>
                          <div className="icon-btn">
                            <span className="icon save">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/>
                                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </span>
                            <span className="icon-label">Save</span>
                          </div>
                          <div className="icon-btn">
                            <span className="icon location">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" stroke="#fff" strokeWidth="2"/>
                                <circle cx="12" cy="10" r="2.5" stroke="#fff" strokeWidth="2"/>
                              </svg>
                            </span>
                            <span className="icon-label">Location</span>
                          </div>
                        </div>

                        <div className="about-box">
                          <div className="about-title">
                            <span className="check">✓</span> About Us
                          </div>
                          <div className="about-text">
                            CopperKing India is a leading copper manufacturer, contract manufacturer and exporter of premium copper, brass and bronze products for wholesalers and importers worldwide.
                          </div>
                        </div>

                        <div className="connect-title">Connect With Us</div>
                        <div className="socials-row">
                          <div className="social-item">
                            <span className="social fb">f</span>
                            <span className="social-label">Facebook</span>
                          </div>
                          <div className="social-item">
                            <span className="social ig">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="2"/>
                                <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
                              </svg>
                            </span>
                            <span className="social-label">Instagram</span>
                          </div>
                          <div className="social-item">
                            <span className="social yt">▶</span>
                            <span className="social-label">YouTube</span>
                          </div>
                          <div className="social-item">
                            <span className="social li">in</span>
                            <span className="social-label">LinkedIn</span>
                          </div>
                        </div>

                        <div className="powered-by">
                          Powered by <span className="pb-brand">Smart<span className="pb-brand-accent">Profile</span>.in</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>

                </div>

              </div>
            </div>

            <div className="pedestal" />
          </div>
        </div>

        {/* STATS BAR */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">💳</span>
            <span className="stat-text">
              <strong>1000+</strong>
              <small>Cards Delivered</small>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📱</span>
            <span className="stat-text">
              <strong>No App</strong>
              <small>Just Tap &amp; Share</small>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">
              <strong>Instant Sharing</strong>
              <small>Tap &amp; Connect</small>
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🛡️</span>
            <span className="stat-text">
              <strong>Premium Profile</strong>
              <small>Professional. Trusted.</small>
            </span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: '#0f172a', padding: '56px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, padding: '6px 18px', fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 16 }}>New Launch</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Order Your NFC Smart Card</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>Tap on any phone, your SmartProfile opens instantly. No app needed. Only ₹{PRICE} — with a <strong style={{ color: '#fff' }}>free Premium Digital Card profile</strong> included.</p>
        </div>
      </section>

      {/* CARD SELECTION */}
      <section style={{ padding: '48px 24px 0', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedColor(card.id)}
                style={{
                  cursor: 'pointer', textAlign: 'center', background: '#fff', borderRadius: 20, padding: '22px 18px',
                  border: selectedColor === card.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  boxShadow: selectedColor === card.id ? '0 8px 28px rgba(99,102,241,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ width: '100%', height: 200, position: 'relative', marginBottom: 16, borderRadius: 14, overflow: 'hidden', background: '#f1f5f9' }}>
                  <Image src={card.img} alt={card.name} fill style={{ objectFit: 'contain', padding: 8 }} sizes="(max-width: 768px) 100vw, 300px" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: selectedColor === card.id ? '#6366f1' : '#0f172a', marginBottom: 3 }}>{card.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>{card.sub}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>₹{PRICE}</div>
                {selectedColor === card.id && (
                  <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#6366f1" fillOpacity="0.15"/><path d="M6 10l3 3 5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '44px 24px 64px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>

          {/* WHAT'S INCLUDED */}
          <div>
            <div style={{ background: '#fff', borderRadius: 18, padding: '24px 26px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 14 }}>What's Included</div>
              {[
                'NFC Smart Card in your chosen color',
                'Custom logo/business name printed on card',
                'QR code linked to your SmartProfile',
                'Free Premium Digital Card profile (worth ₹599)',
                'No upfront payment — pay after approving your design preview',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: 13, color: '#334155' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="8" fill="#6366f1" fillOpacity="0.12"/><path d="M5 8l2 2 4-4" stroke="#6366f1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {item}
                </div>
              ))}
            </div>

            {/* PROCESS STEPS */}
            <div style={{ background: '#fff', borderRadius: 18, padding: '24px 26px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 18 }}>How It Works</div>
              {[
                { title: 'Order', desc: 'Choose your color and place your order for ₹599.' },
                { title: 'Upload Logo & Details', desc: 'Share your logo and business details. Your free Premium Digital Card profile gets created too.' },
                { title: 'Card Creation & Dispatch', desc: 'Your card is dispatched from our Mumbai hub within 72 hours of order confirmation.' },
                { title: 'Delivered to You', desc: 'Courier delivers to your address — typically 3-5 additional days depending on your location. Tap and share your profile instantly.' },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: '#e2e8f0', minHeight: 22 }} />}
                  </div>
                  <div style={{ paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 3 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER FORM */}
          <div>
            {submitted ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '40px 28px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 56, height: 56, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Order Request Received!</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>Our team will contact you within 24 hours with your design preview and delivery details. Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: '28px 26px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Order Details</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Selected: <strong style={{ color: '#0f172a' }}>{CARDS.find(c => c.id === selectedColor)?.name}</strong> — ₹{PRICE}</p>

                {['name', 'phone', 'email', 'business'].map((field) => (
                  <div key={field} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>
                      {field === 'name' && 'Full Name *'}
                      {field === 'phone' && 'Phone Number *'}
                      {field === 'email' && 'Email (optional)'}
                      {field === 'business' && 'Business Name (optional)'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>Delivery Address *</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 5 }}>Notes / Logo details (optional)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g. logo file link, special instructions"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                {error && <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: 13, padding: '10px 14px', borderRadius: 10, marginBottom: 14 }}>{error}</div>}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '14px', borderRadius: 12,
                    fontSize: 15, fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Submitting...' : 'Request Order'}
                </button>
                <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 10 }}>No payment now — we'll send a payment link once you approve your design preview.</p>
              </form>
            )}
          </div>

        </div>
      </section>

      <style jsx>{`
        .anim-hero-wrap {
          background: #f7f6ff;
          overflow: hidden;
        }
        .header-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 100px;
          max-width: 1500px;
          width: 100%;
          margin: 0 auto;
          padding: 60px 60px 20px;
          flex-wrap: wrap;
        }
        .header-text {
          flex: 1;
          min-width: 320px;
          max-width: 560px;
          color: #0a1a4f;
        }
        .headline {
          font-size: 60px;
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 20px;
          color: #0a1a4f;
        }
        .headline-accent {
          background: linear-gradient(90deg, #6c63ff, #005dff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .subtext {
          font-size: 18px;
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 32px;
        }
        .subtext strong { color: #0a1a4f; }
        .cta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .cta-primary {
          background: linear-gradient(90deg, #005dff, #6c63ff);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .cta-secondary {
          background: transparent;
          color: #0a1a4f;
          border: 1px solid rgba(10,26,79,0.25);
          padding: 14px 28px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }
        .visual-wrap {
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(108, 99, 255, 0.15);
          pointer-events: none;
        }
        .bg-ring-1 { width: 360px; height: 360px; }
        .bg-ring-2 { width: 460px; height: 460px; border-color: rgba(108, 99, 255, 0.08); }
        .pedestal {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(70px);
          width: 340px;
          height: 60px;
          background: radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, rgba(108,99,255,0) 70%);
          border-radius: 50%;
          border-top: 1px solid rgba(108,99,255,0.15);
        }
        .feature-float {
          position: absolute;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #fff;
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 8px 24px rgba(10,26,79,0.08);
          width: 180px;
          z-index: 6;
        }
        .ff-1 { top: 4%; right: -180px; }
        .ff-2 { top: 40%; right: -195px; }
        .ff-3 { top: 76%; right: -180px; }
        .ff-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(108,99,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }
        .ff-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ff-text strong { font-size: 13px; color: #0a1a4f; }
        .ff-text small { font-size: 11px; color: #8a94a6; line-height: 1.3; }
        @media (max-width: 1300px) {
          .feature-float { display: none; }
        }
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 40px;
          background: #fff;
          margin: 0 60px 40px;
          padding: 20px 30px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(10,26,79,0.06);
          flex-wrap: wrap;
        }
        .stat-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(108,99,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .stat-text {
          display: flex;
          flex-direction: column;
        }
        .stat-text strong { font-size: 15px; color: #0a1a4f; }
        .stat-text small { font-size: 11px; color: #8a94a6; }
        @media (max-width: 900px) {
          .header-wrap { flex-direction: column-reverse; text-align: center; gap: 40px; }
          .header-text { max-width: 100%; }
          .cta-row { justify-content: center; }
          .headline { font-size: 36px; }
        }

        .scene {
          position: relative;
          width: 300px;
          height: 600px;
        }
        .phone {
          position: absolute;
          inset: 0;
          background: #001144;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0, 17, 68, 0.35);
          padding: 14px;
          overflow: hidden;
          z-index: 3;
        }
        .screen-frame {
          width: 100%;
          height: 100%;
          border-radius: 30px;
          padding: 2.5px;
          background: linear-gradient(160deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02) 100%);
        }
        .phone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #4f6fe0 0%, #7b5fd9 45%, #a85fc9 100%);
          border-radius: 27px;
          overflow: hidden;
        }
        .status-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          z-index: 5;
        }
        .carrier { color: #fff; font-size: 11px; font-weight: 600; opacity: 0.95; }
        .camera-dot {
          position: absolute;
          top: 9px;
          left: 50%;
          transform: translateX(-50%);
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #05070f;
          box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.06);
        }
        .status-icons { display: flex; align-items: center; gap: 4px; }
        .lock-screen {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 60px;
          color: #fff;
          text-align: center;
          z-index: 1;
          animation: lockFade 8s ease-in-out infinite;
        }
        .lock-time { font-size: 52px; font-weight: 600; letter-spacing: 1px; text-shadow: 0 2px 12px rgba(0,0,0,0.15); }
        .lock-date { font-size: 13px; opacity: 0.85; margin-top: 4px; }
        .lock-icons-row { display: flex; gap: 14px; margin-top: auto; margin-bottom: 26px; }
        .app-icon {
          width: 44px; height: 44px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .phone-app { background: linear-gradient(135deg, #34d058 0%, #1a9e3f 100%); }
        .camera-app { background: linear-gradient(135deg, #6b7280 0%, #3f4653 100%); }
        .whatsapp-app { background: #ffffff; }
        .message-app { background: linear-gradient(135deg, #34c9eb 0%, #0a7bc4 100%); }
        @keyframes lockFade {
          0% { opacity: 1; } 27% { opacity: 1; } 38% { opacity: 0; }
          85% { opacity: 0; } 95% { opacity: 1; } 100% { opacity: 1; }
        }
        .profile-card {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          color: #001144;
          background: #ffffff;
          transform: translateY(100%);
          opacity: 0;
          overflow: hidden;
          animation: slideUp 8s ease-in-out infinite;
        }
        .banner { width: 100%; height: 130px; flex-shrink: 0; overflow: hidden; }
        .banner img { width: 100%; height: 100%; object-fit: cover; }
        .logo-wrap {
          width: 74px; height: 74px; border-radius: 50%; background: #fff;
          margin: -37px auto 0; padding: 4px; box-shadow: 0 4px 14px rgba(0,0,0,0.3); z-index: 2;
        }
        .logo { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .profile-body {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          padding: 6px 20px 16px; text-align: center;
          background: linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%);
        }
        .name { font-size: 14px; font-weight: 700; color: #0a1a4f; margin-bottom: 3px; line-height: 1.2; padding: 0 6px; }
        .role { font-size: 11px; color: #4a5568; font-weight: 600; }
        .role-title { font-size: 10px; color: #005dff; font-weight: 500; margin-bottom: 1px; }
        .location { font-size: 10px; color: #8a94a6; margin-bottom: 10px; margin-top: 2px; }
        .btn-row { display: flex; justify-content: center; gap: 12px; width: 100%; margin-bottom: 8px; }
        .icon-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 52px; flex-shrink: 0; }
        .icon { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.18); }
        .icon.call { background: #34d058; }
        .icon.whatsapp { background: #25d366; }
        .icon.save { background: #6c63ff; }
        .icon.location { background: #005dff; }
        .icon-label { font-size: 10px; color: #5b6472; font-weight: 500; white-space: nowrap; }
        .about-box { width: 100%; background: #eef2ff; border-radius: 12px; padding: 10px 12px; margin-bottom: 10px; text-align: left; }
        .about-title { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #005dff; margin-bottom: 4px; }
        .check { width: 13px; height: 13px; border-radius: 50%; background: #005dff; color: #fff; font-size: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .about-text { font-size: 9px; color: #4a5568; line-height: 1.4; }
        .connect-title { font-size: 11px; font-weight: 700; color: #0a1a4f; margin-bottom: 6px; }
        .socials-row { display: flex; justify-content: center; gap: 16px; }
        .social-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .social { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        .social.fb { background: #1877f2; }
        .social.ig { background: linear-gradient(135deg, #f58529, #dd2a7b 45%, #8134af 70%, #515bd4); }
        .social.yt { background: #ff0000; font-size: 11px; }
        .social.li { background: #0a66c2; }
        .social-label { font-size: 9px; color: #8a94a6; }
        .powered-by { margin-top: 10px; font-size: 8px; color: #b0b8c9; }
        .pb-brand { color: #0a1a4f; font-weight: 700; }
        .pb-brand-accent { color: #005dff; }
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          38% { transform: translateY(100%); opacity: 0; }
          52% { transform: translateY(0%); opacity: 1; }
          88% { transform: translateY(0%); opacity: 1; }
          96% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .nfc-card {
          position: absolute; top: -14px; left: 0; width: 220px; z-index: 1;
          filter: drop-shadow(0 14px 24px rgba(0, 17, 68, 0.4));
          animation: nfcTap 8s ease-in-out infinite;
        }
        .nfc-card-img { width: 100%; height: auto; display: block; border-radius: 20px; }
        @keyframes nfcTap {
          0%   { transform: translateX(-380px) rotate(-10deg); opacity: 0; }
          6%   { transform: translateX(-380px) rotate(-10deg); opacity: 1; }
          27%  { transform: translateX(-30px)   rotate(0deg);  opacity: 1; }
          64%  { transform: translateX(-30px)   rotate(0deg);  opacity: 1; }
          78%  { transform: translateX(-380px) rotate(-10deg); opacity: 1; }
          86%  { transform: translateX(-380px) rotate(-10deg); opacity: 0; }
          100% { transform: translateX(-380px) rotate(-10deg); opacity: 0; }
        }

        @media (max-width: 640px) {
          .hero-section {
            padding: 30px 16px 16px;
          }
          .header-wrap {
            gap: 24px;
            padding: 30px 16px 16px;
          }
          .header-text {
            max-width: 100%;
            min-width: 0;
          }
          .headline {
            font-size: 32px;
          }
          .subtext {
            font-size: 15px;
          }
          .cta-row {
            flex-direction: column;
            width: 100%;
          }
          .cta-primary, .cta-secondary {
            width: 100%;
            text-align: center;
          }
          .visual-wrap {
            transform: scale(0.62);
            transform-origin: center;
            margin: -60px 0 -100px;
          }
          .bg-ring,
          .pedestal,
          .nfc-connector,
          .feature-float {
            display: none;
          }
          .stats-bar {
            margin: 0 16px 24px;
            padding: 16px;
            gap: 16px;
            flex-direction: column;
            align-items: flex-start;
          }
          .stat-item {
            width: 100%;
          }
        }

        @media (max-width: 400px) {
          .headline {
            font-size: 26px;
          }
          .visual-wrap {
            transform: scale(0.52);
            margin: -80px 0 -130px;
          }
        }
      `}</style>

    </div>
  );
}