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
    { title: 'Digital Business Profile', desc: 'Full mini-website at one link. Not just a card — your complete business online.', color: '#6366f1', bg: '#eef2ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg> },
    { title: 'NFC Smart Cards', desc: 'Tap your card on any phone. Profile opens instantly. No app needed.', color: '#8b5cf6', bg: '#f5f3ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M12 10v4M10 12h4"/></svg> },
    { title: 'Dynamic QR Code', desc: 'One QR code, always updated. Share on print, banner, packaging anywhere.', color: '#3b82f6', bg: '#eff6ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg> },
    { title: 'Business Directory', desc: 'Get listed in SmartProfile directory. Customers find you by city and category.', color: '#10b981', bg: '#ecfdf5', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { title: 'Lead Generation', desc: 'Capture enquiries directly from your profile. Never miss a business lead.', color: '#f59e0b', bg: '#fffbeb', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { title: 'Analytics Dashboard', desc: 'See who viewed your profile, clicked call, or sent an enquiry.', color: '#ef4444', bg: '#fef2f2', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { title: 'WhatsApp Integration', desc: 'One tap WhatsApp connect. Customers reach you on the app they already use.', color: '#25d366', bg: '#f0fdf4', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> },
    { title: 'Verified Badge', desc: 'Build trust instantly. Verified businesses get more clicks and more leads.', color: '#0ea5e9', bg: '#f0f9ff', svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="26" height="26"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg> },
  ];

  const demoProfiles = [
    { name: 'Rajesh Sharma', role: 'Real Estate Agent', location: 'Pune, Maharashtra, India', tags: ['Residential', 'Commercial', 'Plots'], avatar: 'RS', color1: '#3b82f6', color2: '#6366f1' },
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
    { icon: '🩺', name: 'Doctors', count: '60+ Listed', color: '#10b981', bg: '#ecfdf5' },
    { icon: '💼', name: 'Consultants', count: '95+ Listed', color: '#f59e0b', bg: '#fffbeb' },
    { icon: '🍽️', name: 'Restaurants', count: '40+ Listed', color: '#ef4444', bg: '#fef2f2' },
    { icon: '🛍️', name: 'Retail Stores', count: '70+ Listed', color: '#0ea5e9', bg: '#f0f9ff' },
  ];

  const plans = [
    { name: 'Basic', price: '199', color: '#6366f1', popular: false, desc: 'Perfect to get started', features: ['Logo & Business Name', 'Mobile, WhatsApp & Email', 'Save Contact (VCF)', 'QR Code', 'Free Directory Listing'] },
    { name: 'Business', price: '399', color: '#8b5cf6', popular: false, desc: 'For growing businesses', features: ['Everything in Basic', 'Cover Banner & About Us', 'Address & Google Maps', '2 Social Links', '2 Products/Services', '2 Testimonials'] },
    { name: 'Premium', price: '599', color: '#3b82f6', popular: true, desc: 'Most popular choice', features: ['Everything in Business', '4 Social Links', '5 Products/Services', '10 Gallery Photos', 'PDF Brochure', '1 Video', '5 Testimonials'] },
    { name: 'Pro', price: '999', color: '#f59e0b', popular: false, desc: 'Full power, no limits', features: ['Everything in Premium', 'Unlimited Social Links', '10 Products/Services', '20 Gallery Photos', 'Lead Capture Form', 'Analytics Dashboard', 'Verified Badge', 'Priority Support'] },
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

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#1e293b', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .fade-in { animation: fadeInUp 0.7s ease forwards; }
        .hero-card { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: navScrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: navScrolled ? '1px solid #e2e8f0' : '1px solid transparent', padding: '0 24px', transition: 'all 0.3s', boxShadow: navScrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: 22, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ color: '#0f172a' }}>Smart</span><span style={{ color: '#3b82f6' }}>Profile</span>
          </Link>
          <div style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 500 }}>
            {[['Features','#features'],['Directory','#directory'],['NFC Cards','#nfc-cards'],['Pricing','#pricing'],['Blog','#'],['Contact','#']].map(([label,href]) => (
              <a key={label} href={href} style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#3b82f6'}
                onMouseLeave={e => e.target.style.color='#64748b'}>{label}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none' }}>Login</Link>
            <Link href="/dashboard/create-profile" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '9px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 12px rgba(59,130,246,0.35)', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}>Get Started</Link>
          </div>
        </div>
      </nav>


      {/* HERO */}
      <section style={{ background: 'linear-gradient(120deg, #f8fafc 0%, #eff6ff 45%, #1e3a8a 45%, #1d4ed8 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -150, right: -150, width: 600, height: 600, background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div className="fade-in">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
              Create. Share. Connect.
            </div>
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: '#0f172a' }}>
              One Profile.<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Complete Business.</span>
            </h1>
            <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.75, marginBottom: 36, maxWidth: 470 }}>
              Create your digital business profile, share with QR &amp; NFC cards, get listed in our business directory, and generate more leads.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 40 }}>
              {['Digital Business Profile', 'NFC Smart Cards', 'Business Directory', 'Lead Generation'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: '#334155' }}>
                  <div style={{ width: 22, height: 22, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/dashboard/create-profile" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', padding: '15px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(59,130,246,0.35)' }}>
                Create Your Profile
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link href="/rajesh-sharma" style={{ background: '#fff', color: '#334155', padding: '15px 32px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                View Demo Profile
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div className="hero-card" style={{ position: 'absolute', left: -20, top: '32%', background: '#fff', borderRadius: 18, padding: '18px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 11, textAlign: 'center' }}>
              <div style={{ width: 90, height: 90, background: '#fff', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, padding: 4, border: '1px solid #f1f5f9' }}>
                {[1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,1,1,1,0,1,0,1,1,0].map((v,i)=>(<div key={i} style={{background:v?'#0f172a':'#fff',aspectRatio:'1'}}/>))}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 8 }}>Scan to Connect</div>
            </div>
            <div className="hero-card" style={{ position: 'absolute', top: 10, right: -25, background: 'rgba(255,255,255,0.97)', borderRadius: 16, padding: '14px 18px', boxShadow: '0 8px 28px rgba(0,0,0,0.2)', zIndex: 12, minWidth: 150 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>Profile Views</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>1,250+</div>
              <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>↑ +18% this week</div>
            </div>
            <div className="hero-card" style={{ position: 'absolute', bottom: 40, right: -25, background: 'rgba(255,255,255,0.97)', borderRadius: 16, padding: '14px 18px', boxShadow: '0 8px 28px rgba(0,0,0,0.2)', zIndex: 12, minWidth: 150 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, marginBottom: 4 }}>Leads Captured</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>320+</div>
              <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>↑ +24% this week</div>
            </div>
            <div className="float-anim" style={{ width: 285, height: 575, background: '#0a0f1e', borderRadius: 44, padding: '13px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
              <div style={{ background: 'linear-gradient(160deg, #1e40af 0%, #312e81 50%, #1e1b4b 100%)', borderRadius: 34, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 18px 20px', overflow: 'hidden' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12, border: '4px solid rgba(255,255,255,0.25)' }}>RS</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 3 }}>Rajesh Sharma</div>
                <div style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 4 }}>Real Estate Agent</div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 16 }}>Pune, Maharashtra, India</div>
                <div style={{ display: 'flex', gap: 9, marginBottom: 18 }}>
                  {[['#E4405F','ig'],['#0A66C2','in'],['#1DA1F2','tw'],['#FF0000','yt']].map(([c,s],i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 700 }}>{s}</div>
                  ))}
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: '#3b82f6', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Call</div>
                    <div style={{ flex: 1, background: '#25d366', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>WhatsApp</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#cbd5e1', fontSize: 12, fontWeight: 600 }}>Email</div>
                    <div style={{ flex: 1, background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 600 }}>Website</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 700, marginTop: 2 }}>Save Contact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFC SMART CARDS */}
      <section id="nfc-cards" style={{ padding: '88px 24px', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -150, right: -150, width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 20, padding: '6px 18px', fontSize: 13, fontWeight: 600, color: '#a5b4fc', marginBottom: 18 }}>New Launch</div>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 14 }}>Tap. Connect. Grow.</h2>
            <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>SmartProfile NFC Smart Cards — tap on any phone, your profile opens instantly. No app needed.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 52 }}>
            {[
              { name: 'White Card', sub: 'Classic & Clean', bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', textColor: '#1e293b', shine: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.5)' },
              { name: 'Black Card', sub: 'Bold & Premium', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', textColor: '#fff', shine: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' },
              { name: 'Metal Card', sub: 'Elite & Exclusive', bg: 'linear-gradient(135deg, #9ca3af 0%, #e5e7eb 40%, #9ca3af 60%, #d1d5db 100%)', textColor: '#1e293b', shine: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)' },
            ].map((card, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '32px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)', transition: 'transform 0.3s, border-color 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(99,102,241,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}>
                <div style={{ width: '100%', height: 170, background: card.bg, borderRadius: 18, marginBottom: 22, position: 'relative', overflow: 'hidden', border: card.border, boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg, ${card.shine} 0%, transparent 55%)`, borderRadius: 18 }} />
                  <div style={{ position: 'absolute', bottom: 18, left: 22 }}>
                    <div style={{ fontSize: 9, color: card.textColor, opacity: 0.45, marginBottom: 5, fontWeight: 700, letterSpacing: '0.15em' }}>SMARTPROFILE.IN</div>
                    <div style={{ fontSize: 14, color: card.textColor, fontWeight: 700, letterSpacing: '0.02em' }}>Your Name Here</div>
                  </div>
                  <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.25 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={card.textColor} strokeWidth="1.5"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg>
                  </div>
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{card.name}</div>
                <div style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>{card.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link href="/nfc-cards" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', padding: '15px 36px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(99,102,241,0.45)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              Order NFC Card
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link href="/nfc-cards" style={{ background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', padding: '15px 36px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* WHY SMARTPROFILE */}
      <section id="features" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Why SmartProfile?</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Why Businesses Choose SmartProfile</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: 18, padding: '28px 20px', textAlign: 'center', transition: 'all 0.25s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 16px 40px ${f.color}18`; e.currentTarget.style.borderColor=f.color+'40'; e.currentTarget.style.background='#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#f1f5f9'; e.currentTarget.style.background='#fafafa'; }}>
                <div style={{ width: 56, height: 56, background: f.bg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: f.color }}>
                  {f.svg}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#0f172a' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO PROFILES */}
      <section style={{ padding: '88px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>See It Live</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>SmartProfile in Action</h2>
            <p style={{ color: '#64748b', fontSize: 16, marginTop: 12 }}>Real businesses, real profiles — see how SmartProfile looks</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 44 }}>
            {demoProfiles.map((p, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow=`0 20px 48px ${p.color1}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 24px rgba(0,0,0,0.07)'; }}>
                <div style={{ height: 90, background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                    Verified
                  </div>
                </div>
                <div style={{ padding: '0 22px 26px', marginTop: -32 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 17, border: '3px solid #fff', marginBottom: 14, boxShadow: `0 4px 16px ${p.color1}40` }}>{p.avatar}</div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#0f172a', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 5 }}>{p.role}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {p.location}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                    {p.tags.map((t,j) => <span key={j} style={{ background: '#f1f5f9', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#475569', fontWeight: 600 }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: `linear-gradient(135deg, ${p.color1}, ${p.color2})`, borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Call</div>
                    <div style={{ flex: 1, background: '#25d366', borderRadius: 10, padding: '10px', textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>WhatsApp</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/rajesh-sharma" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '14px 36px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              View Demo Profile
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #6366f1 100%)', padding: '72px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { num: counts.users, suffix: '+', label: 'Active Users', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
            { num: counts.profiles, suffix: '+', label: 'Profiles Created', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/></svg> },
            { num: counts.views, suffix: '+', label: 'Profile Views', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
            { num: counts.biz, suffix: '+', label: 'Businesses Growing', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg> },
          ].map((s, i) => (
            <div key={i} style={{ color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 800, marginBottom: 6, lineHeight: 1 }}>
                {s.num >= 1000 ? `${(s.num/1000).toFixed(s.num >= 10000 ? 0 : 0)}K` : s.num}{s.suffix}
              </div>
              <div style={{ fontSize: 14, opacity: 0.8, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simple Process</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Create. Share. Grow.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 36, left: '13%', right: '13%', height: 2, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6, #10b981)', borderRadius: 2, zIndex: 0, opacity: 0.4 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 72, height: 72, background: '#fff', border: `3px solid ${s.color}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: `0 4px 20px ${s.color}30`, transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.num}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS DIRECTORY */}
      <section id="directory" style={{ padding: '88px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Business Directory</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Get Listed. Get Found.</h2>
            <p style={{ color: '#64748b', fontSize: 16, marginTop: 12, maxWidth: 520, margin: '12px auto 0' }}>Join hundreds of businesses already getting discovered by local customers every day.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 44 }}>
            {directoryCategories.map((cat, i) => (
              <Link key={i} href="/directory" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 28px ${cat.color}18`; e.currentTarget.style.borderColor=cat.color+'50'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#e2e8f0'; }}>
                <div style={{ width: 52, height: 52, background: cat.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 3 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{cat.count}</div>
                </div>
                <svg style={{ color: '#cbd5e1', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/directory" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', padding: '14px 36px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.3)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              Explore Directory
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Choose Your Perfect Plan</h2>
            <p style={{ color: '#64748b', fontSize: 15, marginTop: 12 }}>All plans include QR Code + WhatsApp + Save Contact + Free Directory Listing</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, alignItems: 'start' }}>
            {plans.map((p, i) => (
              <div key={i} style={{ border: p.popular ? `2px solid ${p.color}` : '1px solid #e2e8f0', borderRadius: 22, padding: '30px 22px', position: 'relative', background: p.popular ? 'linear-gradient(160deg, #eff6ff, #f5f3ff)' : '#fafafa', boxShadow: p.popular ? `0 12px 40px ${p.color}22` : 'none', transition: 'transform 0.25s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-5px)'}
                onMouseLeave={e => e.currentTarget.style.transform='none'}>
                {p.popular && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${p.color}, #8b5cf6)`, color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>MOST POPULAR</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>₹</span>
                  <span style={{ fontSize: 40, fontWeight: 800, color: '#0f172a' }}>{p.price}</span>
                  <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 2 }}>/year</span>
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>{p.desc}</div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 18, marginBottom: 22 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10, fontSize: 12, color: '#334155' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="8" cy="8" r="8" fill={p.color} fillOpacity="0.12"/><path d="M5 8l2 2 4-4" stroke={p.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/create-profile" style={{ display: 'block', textAlign: 'center', background: p.popular ? `linear-gradient(135deg, ${p.color}, #8b5cf6)` : 'transparent', color: p.popular ? '#fff' : p.color, border: `2px solid ${p.color}`, padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: '88px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 800, color: '#0f172a' }}>Compare All Plans</h2>
            <p style={{ color: '#64748b', marginTop: 10, fontSize: 15 }}>See exactly what you get with each plan</p>
          </div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <div style={{ padding: '18px 22px', fontWeight: 700, fontSize: 13, color: '#64748b' }}>Feature</div>
              {[['Basic','#6366f1'],['Business','#8b5cf6'],['Premium','#3b82f6'],['Pro','#f59e0b']].map(([name,color],i) => (
                <div key={i} style={{ padding: '18px 12px', textAlign: 'center', fontWeight: 800, fontSize: 13, color: name==='Premium' ? '#3b82f6' : '#1e293b' }}>
                  {name}{name==='Premium' && <span style={{ display: 'block', fontSize: 10, color: '#3b82f6', fontWeight: 600, marginTop: 2 }}>★ Popular</span>}
                </div>
              ))}
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', borderBottom: i < comparisonRows.length-1 ? '1px solid #f1f5f9' : 'none', background: i%2===0 ? '#fff' : '#fafafa', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='#f0f9ff'}
                onMouseLeave={e => e.currentTarget.style.background=i%2===0?'#fff':'#fafafa'}>
                <div style={{ padding: '15px 22px', fontSize: 13, color: '#334155', fontWeight: 500 }}>{row.feature}</div>
                {[row.b, row.bu, row.p, row.pr].map((val, j) => (
                  <div key={j} style={{ padding: '15px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {val
                      ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.15"/><path d="M6 10l3 3 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#ef4444" fillOpacity="0.1"/><path d="M7 13l6-6M13 13L7 7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/></svg>
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '88px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Testimonials</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>What Our Users Say</h2>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f0f4ff)', borderRadius: 24, padding: '44px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)', position: 'relative', border: '1px solid #e2e8f0', minHeight: 230 }}>
            <div style={{ fontSize: 64, color: '#3b82f6', lineHeight: 0.8, marginBottom: 20, fontFamily: 'Georgia, serif', opacity: 0.25, fontWeight: 900 }}>"</div>
            <p style={{ fontSize: 18, color: '#334155', lineHeight: 1.8, marginBottom: 30, fontStyle: 'italic', fontWeight: 400 }}>{testimonials[activeTestimonial].text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg, ${testimonials[activeTestimonial].color}, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, boxShadow: `0 4px 16px ${testimonials[activeTestimonial].color}40` }}>{testimonials[activeTestimonial].avatar}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{testimonials[activeTestimonial].name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{testimonials[activeTestimonial].role}</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 28, right: 28, display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setActiveTestimonial((activeTestimonial-1+testimonials.length)%testimonials.length)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#3b82f6'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#3b82f6'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#64748b'; e.currentTarget.style.borderColor='#e2e8f0'; }}>‹</button>
              {testimonials.map((_, i) => (
                <div key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i===activeTestimonial?22:8, height: 8, borderRadius: 4, background: i===activeTestimonial?'#3b82f6':'#e2e8f0', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
              <button onClick={() => setActiveTestimonial((activeTestimonial+1)%testimonials.length)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 18, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#3b82f6'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#3b82f6'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color='#64748b'; e.currentTarget.style.borderColor='#e2e8f0'; }}>›</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '88px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a' }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: `1px solid ${openFaq===i?'#bfdbfe':'#e2e8f0'}`, borderRadius: 14, overflow: 'hidden', background: '#fff', boxShadow: openFaq===i?'0 4px 20px rgba(59,130,246,0.08)':'none', transition: 'all 0.2s' }}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: openFaq===i?'#3b82f6':'#1e293b', lineHeight: 1.4 }}>{faq.q}</span>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: openFaq===i?'#3b82f6':'#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 16, transition: 'all 0.2s' }}>
                    <span style={{ color: openFaq===i?'#fff':'#64748b', fontSize: 18, lineHeight: 1, transform: openFaq===i?'rotate(45deg)':'none', display: 'block', transition: 'transform 0.2s' }}>+</span>
                  </div>
                </button>
                {openFaq===i && <div style={{ padding: '0 24px 20px', fontSize: 14, color: '#64748b', lineHeight: 1.75, borderTop: '1px solid #f1f5f9' }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #3b82f6 70%, #6366f1 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.12)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0, backdropFilter: 'blur(10px)' }}>🚀</div>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 24, marginBottom: 6, lineHeight: 1.3 }}>Start Your Digital Journey Today!</h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15 }}>Create your smart profile in 5 minutes. No technical skills needed.</p>
            </div>
          </div>
          <Link href="/dashboard/create-profile" style={{ background: '#fff', color: '#3b82f6', padding: '15px 36px', borderRadius: 12, fontSize: 15, fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'transform 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='none'}>
            Get Started Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0f1e', padding: '68px 24px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 52 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 14 }}>
                <span style={{ color: '#fff' }}>Smart</span><span style={{ color: '#3b82f6' }}>Profile</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, marginBottom: 24, color: '#475569', maxWidth: 240 }}>One Profile. Complete Business. India ka #1 digital business profile platform.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>,
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a0f1e"/></svg>
                ].map((icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(59,130,246,0.2)'; e.currentTarget.style.color='#60a5fa'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#64748b'; }}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features','Directory','NFC Cards','Pricing','How it Works'] },
              { title: 'Company', links: ['About Us','Blog','Careers','Contact Us'] },
              { title: 'Support', links: ['Help Center','Terms of Service','Privacy Policy','Refund Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ color: '#fff', fontWeight: 700, marginBottom: 18, fontSize: 14, letterSpacing: '0.02em' }}>{col.title}</div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: 11 }}>
                    <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color='#94a3b8'}
                      onMouseLeave={e => e.target.style.color='#475569'}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#334155' }}>© 2024 SmartProfile.in — All rights reserved.</div>
            <div style={{ fontSize: 13, color: '#334155' }}>Made with ❤️ in India</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
