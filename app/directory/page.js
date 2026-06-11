'use client';
import { useState } from 'react';
import Link from 'next/link';

const categories = [
  { name: 'Manufacturers', icon: '🏭', count: '120+', color: '#3b82f6' },
  { name: 'Real Estate', icon: '🏠', count: '95+', color: '#8b5cf6' },
  { name: 'Doctors', icon: '⚕️', count: '80+', color: '#10b981' },
  { name: 'Consultants', icon: '💼', count: '110+', color: '#f59e0b' },
  { name: 'Restaurants', icon: '🍽️', count: '70+', color: '#ef4444' },
  { name: 'Retail Shops', icon: '🛍️', count: '150+', color: '#06b6d4' },
];

const businesses = [
  { name: 'Dream Home Realty', category: 'Real Estate', city: 'Mumbai', rating: 4.8, reviews: 124, verified: true, initials: 'DH', color: '#3b82f6' },
  { name: 'HealthFirst Clinic', category: 'Doctor', city: 'Pune', rating: 4.9, reviews: 89, verified: true, initials: 'HF', color: '#10b981' },
  { name: 'Sharma Manufacturers', category: 'Manufacturer', city: 'Nashik', rating: 4.7, reviews: 56, verified: false, initials: 'SM', color: '#f59e0b' },
  { name: 'TaxPro Consultants', category: 'Consultant', city: 'Thane', rating: 4.6, reviews: 43, verified: true, initials: 'TP', color: '#8b5cf6' },
  { name: 'Spice Garden Restaurant', category: 'Restaurant', city: 'Nagpur', rating: 4.5, reviews: 201, verified: false, initials: 'SG', color: '#ef4444' },
  { name: 'Fashion Hub', category: 'Retail', city: 'Aurangabad', rating: 4.4, reviews: 67, verified: true, initials: 'FH', color: '#06b6d4' },
];

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const filtered = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase());
    const matchCity = !selectedCity || b.city === selectedCity;
    const matchCat = !selectedCat || b.category === selectedCat;
    return matchSearch && matchCity && matchCat;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Background dots */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* India Map SVG background */}
        <svg style={{ position: 'absolute', right: '5%', top: '10%', opacity: 0.07, width: '40%', maxWidth: 400 }} viewBox="0 0 400 480" fill="white">
          <path d="M200,20 L280,60 L320,80 L350,120 L360,160 L340,200 L360,240 L350,280 L320,310 L300,340 L280,370 L260,400 L240,430 L220,450 L200,460 L180,450 L160,430 L140,400 L120,370 L100,340 L80,310 L50,280 L40,240 L60,200 L40,160 L50,120 L80,80 L120,60 L160,40 Z"/>
        </svg>

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, background: '#3b82f6', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 500 }}>India ka #1 Business Directory</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: 'white', margin: '0 0 16px', lineHeight: 1.1 }}>
            Find Local Businesses<br />
            <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Near You</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            1000+ verified businesses across Maharashtra. Discover, connect, and grow.
          </p>

          {/* Search Bar */}
          <div style={{ display: 'flex', gap: 12, maxWidth: 640, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="Search business, category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 220, padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 15, outline: 'none', backdropFilter: 'blur(8px)' }}
            />
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}
            >
              <option value="" style={{ color: '#000' }}>All Cities</option>
              <option value="Mumbai" style={{ color: '#000' }}>Mumbai</option>
              <option value="Pune" style={{ color: '#000' }}>Pune</option>
              <option value="Thane" style={{ color: '#000' }}>Thane</option>
              <option value="Nashik" style={{ color: '#000' }}>Nashik</option>
              <option value="Nagpur" style={{ color: '#000' }}>Nagpur</option>
            </select>
            <button style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Search
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            {[['1000+', 'Businesses'], ['50+', 'Cities'], ['10K+', 'Monthly Visitors'], ['500+', 'Verified']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>{num}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '48px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: 32 }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map(cat => (
              <div key={cat.name} onClick={() => setSelectedCat(selectedCat === cat.name ? '' : cat.name)}
                style={{ padding: '24px 16px', borderRadius: 16, border: `2px solid ${selectedCat === cat.name ? cat.color : '#f1f5f9'}`, background: selectedCat === cat.name ? `${cat.color}10` : '#f8fafc', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: cat.color, fontWeight: 500 }}>{cat.count} listed</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS LISTINGS */}
      <section style={{ padding: '48px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {filtered.length} Businesses Found
            </h2>
            <select onChange={e => setSelectedCity(e.target.value)} value={selectedCity}
              style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
              <option value="">All Cities</option>
              {['Mumbai','Pune','Thane','Nashik','Nagpur','Aurangabad'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filtered.map(biz => (
              <div key={biz.name} style={{ background: 'white', borderRadius: 20, padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${biz.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: biz.color, fontSize: 16, flexShrink: 0 }}>
                    {biz.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>{biz.name}</span>
                      {biz.verified && <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>✓ Verified</span>}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{biz.category} • 📍 {biz.city}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i <= Math.floor(biz.rating) ? '#fbbf24' : '#e2e8f0'}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{biz.rating}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>({biz.reviews} reviews)</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={{ flex: 1, padding: '10px', background: `${biz.color}15`, color: biz.color, border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View Profile</button>
                  <button style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>No businesses found</div>
              <div style={{ fontSize: 14 }}>Try a different search or category</div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 12 }}>List Your Business Free</h2>
        <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 16 }}>Join 1000+ businesses already on SmartProfile</p>
        <Link href="/register" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
          Create Free Profile →
        </Link>
      </section>

    </div>
  );
}
