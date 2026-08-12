'use client';
import { useState } from 'react';
import Image from 'next/image';

const CARDS = [
  { id: 'black', name: 'Black Card', sub: 'Bold & Premium', img: 'https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/NFC/black-nfc-card.webp' },
  { id: 'gold', name: 'Gold Card', sub: 'Elite & Exclusive', img: 'https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/NFC/golden-nfc-card.webp' },
  { id: 'silver', name: 'Metallic Silver Card', sub: 'Premium & Sleek', img: 'https://lekyzsyadanghxafpjmh.supabase.co/storage/v1/object/public/NFC/silver-nfc-card.webp' },
];

const PRICE = 599;

export default function NFCCardsPage() {
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
      const cardLabel = CARDS.find(c => c.id === selectedColor)?.name || selectedColor;
      const message = `NFC Card Order\nColor: ${cardLabel}\nBusiness: ${form.business || '(not given)'}\nDelivery Address: ${form.address}\nNotes: ${form.notes || '(none)'}\nPrice: ₹${PRICE} + Free Premium Digital Card Profile`;
      const res = await fetch('/api/leads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          contact: form.phone + (form.email ? ` / ${form.email}` : ''),
          message,
          source: 'nfc_card_order',
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
                { title: 'Card Creation & Dispatch', desc: 'We design and dispatch your NFC card within 72 working hours.' },
                { title: 'Delivered to You', desc: 'Card arrives at your address — tap and share your profile instantly.' },
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
    </div>
  );
}