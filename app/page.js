'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [counts, setCounts] = useState({ users: 0, profiles: 0, views: 0, biz: 0 });
  const [navScrolled, setNavScrolled] = useState(false);
  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsStarted) {
        setStatsStarted(true);
        const targets = { users: 500, profiles: 1000, views: 50000, biz: 200 };
        const steps = 80;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const p = Math.min(step / steps, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCounts({
            users: Math.floor(targets.users * ease),
            profiles: Math.floor(targets.profiles * ease),
            views: Math.floor(targets.views * ease),
            biz: Math.floor(targets.biz * ease),
          });
          if (step >= steps) clearInterval(timer);
        }, 25);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsStarted]);

  const features = [
    { title: 'Digital Business Profile', desc: 'Full mini-website at one link. Not just a card — your complete business online.', color: '#6366f1', bg: '#eef2ff' },
    { title: 'NFC Smart Cards', desc: 'Tap your card on any phone. Profile opens instantly. No app needed.', color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Dynamic QR Code', desc: 'One QR code, always updated. Share on print, banner, packaging anywhere.', color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Business Directory', desc: 'Get listed in SmartProfile directory. Customers find you by city and category.', color: '#10b981', bg: '#ecfdf5' },
    { title: 'Lead Generation', desc: 'Capture enquiries directly from your profile. Never miss a business lead.', color: '#f59e0b', bg: '#fffbeb' },
    { title: 'Analytics Dashboard', desc: 'See who viewed your profile, clicked call, or sent an enquiry.', color: '#ef4444', bg: '#fef2f2' },
    { title: 'WhatsApp Integration', desc: 'One tap WhatsApp connect. Customers reach you on the app they already use.', color: '#25d366', bg: '#f0fdf4' },
    { title: 'Verified Badge', desc: 'Build trust instantly. Verified businesses get more clicks and more leads.', color: '#0ea5e9', bg: '#f0f9ff' },
  ];

  const demoProfiles = [
    { name: 'Rajesh Sharma', role: 'Real Estate Agent', location: 'Pune, Maharashtra', tags: ['Residential', 'Commercial', 'Plots'], avatar: 'RS', color1: '#3b82f6', color2: '#6366f1' },
    { name: 'Kapoor Industries', role: 'Steel Manufacturer', location: 'Mumbai, Maharashtra', tags: ['Steel', 'Pipes', 'Export'], avatar: 'KI', color1: '#10b981', color2: '#059669' },
    { name: 'Dr. Priya Desai', role: 'General Physician', location: 'Nashik, Maharashtra', tags: ['Consultation', 'OPD', 'Home Visit'], avatar: 'PD', color1: '#8b5cf6', color2: '#7c3aed' },
  ];

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Add business details and customize in minutes.', color: '#6366f1' },
    { num: '02', title: 'Share Everywhere', desc: 'Share via QR, NFC card, WhatsApp or direct link.', color: '#8b5cf6' },
    { num: '03', title: 'Get Discovered', desc: 'Appear in SmartProfile directory by city and category.', color: '#3b82f6' },
    { num: '04', title: 'Grow Your Business', desc: 'Capture leads, track analytics, build trust.', color: '#10b981' },
  ];

  const directoryCategories = [
    { icon: '🏭', name: 'Manufacturers', count: '120+ Listed', color: '#3b82f6', bg: '#eff6ff' },
    { icon: '🏠', name: 'Real Estate', count: '85+ Listed', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: '🏥', name: 'Doctors', count: '60+ Listed', color: '#10b981', bg: '#ecfdf5' },
    { icon: '💼', name: 'Consultants', count: '95+ Listed', color: '#f59e0b', bg: '#fffbeb' },
    { icon: '🍽️', name: 'Restaurants', count: '40+ Listed', color: '#ef4444', bg: '#fef2f2' },
    { icon: '🛒', name: 'Retail Stores', count: '70+ Listed', color: '#0ea5e9', bg: '#f0f9ff' },
  ];

  const plans = [
    { name: 'Basic', price: '199', color: '#6366f1', popular: false, desc: 'Perfect to get started', features: ['Logo & Business Name', 'Mobile, WhatsApp & Email', 'Save Contact (VCF)', 'QR Code', 'Free Directory Listing'] },
    { name: 'Business', price: '399', color: '#8b5cf6', popular: false, desc: 'For growing businesses', features: ['Everything in Basic', 'Cover Banner & About Us', 'Address & Google Maps', '2 Social Links', '2 Products/Services', '2 Testimonials'] },
    { name: 'Premium', price: '599', color: '#3b82f6', popular: true, desc: 'Most popular choice', features: ['Everything in Business', '4 Social Links', '5 Products/Services', '10 Gallery Photos', 'PDF Brochure', '1 Video', '5 Testimonials'] },
    { name: 'Pro', price: '999', color: '#f59e0b', popular: false, desc: 'Full power, no limits', features: ['Everything in Premium', 'Unlimited Social Links', '10 Products/Services', '20 Gallery Photos', 'Lead Capture Form', 'Analytics Dashboard', 'Verified Badge', 'Priority Support'] },
  ];

  const testimonials = [
    { name: 'Rohit Sharma', role: 'Founder, Digital Agency — Pune', text: 'SmartProfile completely changed how I share my business. One link and clients see everything — services, gallery, contact. Extremely professional.', avatar: 'RS', color: '#6366f1' },
    { name: 'Priya Kapoor', role: 'Real Estate Agent — Mumbai', text: 'I used to spend thousands printing visiting cards. Now I share my SmartProfile QR code and get leads the same day. Totally worth it!', avatar: 'PK', color: '#10b981' },
    { name: 'Dr. Amit Verma', role: 'General Physician — Nashik', text: 'My patients connect directly via WhatsApp from my profile. Appointment booking became so simple. I highly recommend SmartProfile.', avatar: 'AV', color: '#8b5cf6' },
  ];

  const faqs = [
    { q: 'What is the difference between SmartProfile and a simple visiting card?', a: 'A visiting card only gives name and number. SmartProfile is a complete mini-website — photos, services, gallery, reviews, Google Maps, lead form — all in one link.' },
    { q: 'How does the NFC Card work?', a: 'Hold the NFC card near any smartphone — your profile opens automatically in the browser. No app download needed. Works on both Android and iPhone.' },
    { q: 'Can I upgrade my plan later?', a: 'Yes! You can upgrade from Basic to Business, Premium or Pro anytime. Remaining time is adjusted on a pro-rata basis.' },
    { q: 'Is the Business Directory listing free?', a: 'Yes! Free Directory Listing is included in all plans. Local customers can find you by city and category — completely free.' },
    { q: 'How long does it take to create a profile?', a: 'Just 5-10 minutes! Fill in your basic details, upload your logo, choose a plan and your profile goes live at smartprofile.in/your-name.' },
    { q: 'What is the refund policy?', a: 'We offer a 7-day money back guarantee. If SmartProfile does not work for you, get a full refund. No questions asked.' },
  ];

  const comparisonRows = [
    { feature: 'Digital Profile', b: true, bu: true, p: true, pr: true },
    { feature: 'QR Code', b: true, bu: true, p: true, pr: true },
    { feature: 'Directory Listing', b: true, bu: true, p: true, pr: true },
    { feature: 'Cover Banner', b: false, bu: true, p: true, pr: true },
    { feature: 'Google Maps', b: false, bu: true, p: true, pr: true },
    { feature: 'Gallery Photos', b: false, bu: false, p: true, pr: true },
    { feature: 'PDF Brochure', b: false, bu: false, p: true, pr: true },
    { feature: 'Lead Capture Form', b: false, bu: false, p: false, pr: true },
    { feature: 'Analytics Dashboard', b: false, bu: false, p: false, pr: true },
    { feature: 'Verified Badge', b: false, bu: false, p: false, pr: true },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#1e293b', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .fade-in { animation: fadeInUp 0.7s ease forwards; }
        .hero-card { animation: fadeInUp 0.5s ease forwards; }

        @media (max-width: 768px) {
          .hero-section { grid-template-columns: 1fr !important; padding: 40px 20px 48px !important; min-height: auto !important; background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%) !important; }
          .hero-phone-col { display: none !important; }
          .hero-text-col { text-align: center !important; }
          .hero-checklist { grid-template-columns: 1fr 1fr !important; }
          .hero-btns { justify-content: center !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .nfc-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .demo-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .steps-line { display: none !important; }
          .dir-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .plans-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .compare-table { display: none !important; }
          .cta-row { flex-direction: column !important; text-align: center !important; align-items: center !important; }
          .section-pad { padding: 60px 20px !important; }
          .section-pad-sm { padding: 48px 20px !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .hero-checklist { grid-template-columns: 1fr !important; }
          .dir-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }} className="hero-section">
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div className="fade-in hero-text-col">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
              Create. Share. Connect.
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 5vw, 62px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: '#0f172a' }}>
              One Profile.<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Complete Business.</span>
            </h1>
            <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.75, marginBottom: 32, maxWidth: 470 }}>
              Create your digital business profile, share with QR &amp; NFC cards, get listed in our business directory, and generate more leads.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 36 }} className="hero-checklist">
              {['Digital Business Profile', 'NFC Smart Cards', 'Business Directory', 'Lead Generation'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: '#334155' }}>
                  <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }} className="hero-btns">
              <Link href="/dashboard/create-profile" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', padding: '15px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}>
                Create Your Profile
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/rajesh-sharma" style={{ background: '#fff', color: '#334155', padding: '15px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                View Demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} className="hero-phone-col">
            <div className="float-anim" style={{ width: 285, height: 575, background: '#0a0f1e', borderRadius: 44, padding: '13px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
              <div style={{ background: 'linear-gradient(160deg, #1e40af 0%, #312e81 50%, #1e1b4b 100%)', borderRadius: 34, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 18px 20px', overflow: 'hidden' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12, border: '4px solid rgba(255,255,255,0.25)' }}>RS</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 3 }}>Rajesh Sharma</div>
                <div style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 4 }}>Real Estate Agent</div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 16 }}>Pune, Maharashtra</div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: '#3b82f6', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Call</div>
                    <div style={{ flex: 1, background: '#25d366', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>WhatsApp</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>Save Contact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFC SMART CARDS */}
      <section id="nfc-cards" style={{ padding: '88px 24px', background: '#0f172a', position: 'relative', overflow: 'hidden' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, padding: '6px 18px', fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 18 }}>New Launch</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Tap. Connect. Grow.</h2>
            <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>SmartProfile NFC Smart Cards — tap on any phone, your profile opens instantly. No app needed.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 44 }} className="nfc-grid">
            {[
              { name: 'White Card', sub: 'Classic & Clean', bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', textColor: '#1e293b', shine: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.5)' },
              { name: 'Black Card', sub: 'Bold & Premium', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', textColor: '#fff', shine: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' },
              { name: 'Metal Card', sub: 'Elite & Exclusive', bg: 'linear-gradient(135deg, #9ca3af 0%, #e5e7eb 40%, #9ca3af 60%, #d1d5db 100%)', textColor: '#1e293b', shine: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' },
            ].map((card, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '28px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width: '100%', height: 160, background: card.bg, borderRadius: 16, marginBottom: 20, position: 'relative', overflow: 'hidden', border: card.border, boxShadow: '0 20px 40px rgba(0,0,0,0.35)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg, ${card.shine} 0%, transparent 55%)`, borderRadius: 16 }} />
                  <div style={{ position: 'absolute', bottom: 16, left: 20 }}>
                    <div style={{ fontSize: 9, color: card.textColor, opacity: 0.45, marginBottom: 4, fontWeight: 700, letterSpacing: '0.15em' }}>SMARTPROFILE.IN</div>
                    <div style={{ fontSize: 13, color: card.textColor, fontWeight: 700 }}>Your Name Here</div>
                  </div>
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{card.name}</div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>{card.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/nfc-cards" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Order NFC Card
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link href="/nfc-cards" style={{ background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* WHY SMARTPROFILE */}
      <section id="features" style={{ padding: '88px 24px', background: '#fff' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why SmartProfile?</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Why Businesses Choose SmartProfile</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }} className="features-grid">
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 18, padding: '24px 18px', textAlign: 'center' }}>
                <div style={{ width: 54, height: 54, background: f.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: f.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/></svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7, color: '#0f172a' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO PROFILES */}
      <section style={{ padding: '88px 24px', background: '#f8fafc' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>See It Live</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>SmartProfile in Action</h2>
            <p style={{ color: '#64748b', fontSize: 15, marginTop: 10 }}>Real businesses, real profiles — see how SmartProfile looks</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }} className="demo-grid">
            {demoProfiles.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9' }}>
                <div style={{ height: 88, background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 12, right: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#fff', fontWeight: 600 }}>✓ Verified</div>
                </div>
                <div style={{ padding: '0 20px 24px', marginTop: -30 }}>
                  <div style={{ width: 58, height: 58, borderRadius: '50%', background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, border: '3px solid #fff', marginBottom: 12 }}>{p.avatar}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>{p.role}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 14 }}>📍 {p.location}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {p.tags.map((t,j) => <span key={j} style={{ background: '#f1f5f9', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: '#475569', fontWeight: 600 }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, borderRadius: 10, padding: '9px', textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>Call</div>
                    <div style={{ flex: 1, background: '#25d366', borderRadius: 10, padding: '9px', textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>WhatsApp</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/rajesh-sharma" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '13px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              View Demo Profile
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)', padding: '72px 24px' }} className="section-pad-sm">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }} className="stats-grid">
          {[
            { num: counts.users, suffix: '+', label: 'Active Users' },
            { num: counts.profiles, suffix: '+', label: 'Profiles Created' },
            { num: counts.views, suffix: '+', label: 'Profile Views' },
            { num: counts.biz, suffix: '+', label: 'Businesses Growing' },
          ].map((s, i) => (
            <div key={i} style={{ color: '#fff' }}>
              <div style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, marginBottom: 6, lineHeight: 1 }}>
                {s.num >= 1000 ? `${Math.floor(s.num/1000)}K` : s.num}{s.suffix}
              </div>
              <div style={{ fontSize: 14, opacity: 0.8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '88px 24px', background: '#fff' }} className="section-pad">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simple Process</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Create. Share. Grow.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }} className="steps-grid">
            <div style={{ position: 'absolute', top: 36, left: '13%', right: '13%', height: 2, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6, #10b981)', borderRadius: 2, zIndex: 0, opacity: 0.4 }} className="steps-line" />
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 68, height: 68, background: '#fff', border: `3px solid ${s.color}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 4px 20px ${s.color}30` }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.num}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 7 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS DIRECTORY */}
      <section id="directory" style={{ padding: '88px 24px', background: '#f8fafc' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Business Directory</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Get Listed. Get Found.</h2>
            <p style={{ color: '#64748b', fontSize: 15, marginTop: 10, maxWidth: 500, margin: '10px auto 0' }}>Join hundreds of businesses already getting discovered by local customers every day.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }} className="dir-grid">
            {directoryCategories.map((cat, i) => (
              <Link key={i} href="/directory" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ width: 48, height: 48, background: cat.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{cat.count}</div>
                </div>
                <svg style={{ color: '#cbd5e1', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/directory" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '13px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              Explore Directory
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '88px 24px', background: '#fff' }} className="section-pad">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Choose Your Perfect Plan</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 10 }}>All plans include QR Code + WhatsApp + Save Contact + Free Directory Listing</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, alignItems: 'start' }} className="plans-grid">
            {plans.map((p, i) => (
              <div key={i} style={{ border: p.popular ? `2px solid ${p.color}` : '1px solid #e2e8f0', borderRadius: 20, padding: '28px 20px', position: 'relative', background: p.popular ? 'linear-gradient(160deg, #eff6ff, #f5f3ff)' : '#fafafa' }}>
                {p.popular && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${p.color}, #8b5cf6)`, color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Rs.</span>
                  <span style={{ fontSize: 38, fontWeight: 800, color: '#0f172a' }}>{p.price}</span>
                  <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 2 }}>/year</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 18 }}>{p.desc}</div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginBottom: 18 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 9, fontSize: 12, color: '#334155' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="8" fill={p.color} fillOpacity="0.12"/><path d="M5 8l2 2 4-4" stroke={p.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/create-profile" style={{ display: 'block', textAlign: 'center', background: p.popular ? `linear-gradient(135deg, ${p.color}, #8b5cf6)` : 'transparent', color: p.popular ? '#fff' : p.color, border: `2px solid ${p.color}`, padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '88px 24px', background: '#fff' }} className="section-pad">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Testimonials</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>What Our Users Say</h2>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f0f4ff)', borderRadius: 22, padding: '36px 28px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 56, color: '#3b82f6', lineHeight: 0.8, marginBottom: 18, fontFamily: 'Georgia, serif', opacity: 0.25, fontWeight: 900 }}>"</div>
            <p style={{ fontSize: 16, color: '#334155', lineHeight: 1.8, marginBottom: 26, fontStyle: 'italic' }}>{testimonials[activeTestimonial].text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${testimonials[activeTestimonial].color}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{testimonials[activeTestimonial].avatar}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={() => setActiveTestimonial((activeTestimonial-1+testimonials.length)%testimonials.length)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 16, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
              {testimonials.map((_, i) => (
                <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i===activeTestimonial?20:8, height: 8, borderRadius: 4, background: i===activeTestimonial?'#3b82f6':'#e2e8f0', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
              <button onClick={() => setActiveTestimonial((activeTestimonial+1)%testimonials.length)} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 16, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '88px 24px', background: '#f8fafc' }} className="section-pad">
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: `1px solid ${openFaq===i?'#bfdbfe':'#e2e8f0'}`, borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: openFaq===i?'0 4px 20px rgba(59,130,246,0.08)':'none' }}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: openFaq===i?'#3b82f6':'#1e293b', lineHeight: 1.4, flex: 1 }}>{faq.q}</span>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: openFaq===i?'#3b82f6':'#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: openFaq===i?'#fff':'#64748b', fontSize: 16, lineHeight: 1, display: 'block' }}>{openFaq===i?'−':'+'}</span>
                  </div>
                </button>
                {openFaq===i && <div style={{ padding: '0 20px 18px', fontSize: 13, color: '#64748b', lineHeight: 1.75, borderTop: '1px solid #f1f5f9' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #3b82f6 70%, #6366f1 100%)', position: 'relative', overflow: 'hidden' }} className="section-pad-sm">
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap', position: 'relative', zIndex: 1 }} className="cta-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.12)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🚀</div>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 5, lineHeight: 1.3 }}>Start Your Digital Journey Today!</h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14 }}>Create your smart profile in 5 minutes. No technical skills needed.</p>
            </div>
          </div>
          <Link href="/dashboard/create-profile" style={{ background: '#fff', color: '#3b82f6', padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}>
            Get Started Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
