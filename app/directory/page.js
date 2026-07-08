'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const categories = [
  { name: 'Estate Agents', icon: '🏠' },
  { name: 'AC Repairing', icon: '❄️' },
  { name: 'Doctors', icon: '⚕️' },
  { name: 'Dentists', icon: '🦷' },
  { name: 'Physiotherapy', icon: '🏃' },
  { name: 'Salons', icon: '✂️' },
  { name: 'Restaurants', icon: '🍽️' },
  { name: 'Education', icon: '🎓' },
  { name: 'Travel Agents', icon: '✈️' },
  { name: 'Automotive', icon: '🚗' },
];

function StarRating({ rating }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill={i <= Math.floor(rating) ? '#f59e0b' : '#e2e8f0'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

// Cleans a phone number and returns a wa.me / tel friendly digits-only string with country code
function cleanPhone(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10) return '91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

export default function DirectoryPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true);
      if (error || !data) return;

      const profileIds = data.map(p => p.id);

      const { data: allTestimonials } = await supabase
        .from('testimonials')
        .select('profile_id, rating');

      const ratingMap = {};
      (allTestimonials || []).forEach(t => {
        if (!ratingMap[t.profile_id]) ratingMap[t.profile_id] = { sum: 0, count: 0 };
        ratingMap[t.profile_id].sum += t.rating || 0;
        ratingMap[t.profile_id].count += 1;
      });

      // Try to fetch services/tags per profile — if the table or columns don't exist,
      // this fails silently and cards just fall back to showing category only.
      let servicesMap = {};
      try {
        const { data: allServices } = await supabase
          .from('services')
          .select('profile_id, name')
          .in('profile_id', profileIds);
        (allServices || []).forEach(s => {
          if (!servicesMap[s.profile_id]) servicesMap[s.profile_id] = [];
          if (s.name) servicesMap[s.profile_id].push(s.name);
        });
      } catch (e) {
        servicesMap = {};
      }

      setBusinesses(data.map(p => {
        const r = ratingMap[p.id];
        const avgRating = r ? (r.sum / r.count) : 0;
        const reviewCount = r ? r.count : 0;
        return {
          id: p.id,
          name: p.business_name || p.full_name || p.username,
          category: p.category || 'General',
          city: p.city || '',
          state: p.state || '',
          address: p.address || '',
          rating: avgRating,
          reviews: reviewCount,
          verified: !!p.is_active,
          initials: (p.business_name || p.full_name || '?').substring(0,2).toUpperCase(),
          color: '#3b82f6',
          img: p.logo_url || null,
          username: p.username,
          // NOTE: assuming column name is "phone" — tell me if it's actually
          // "mobile" or "contact_number" and I'll fix this in one line.
          phone: cleanPhone(p.phone),
          tags: (servicesMap[p.id] || []).slice(0, 4),
        };
      }));
    }
    fetchProfiles();
  }, []);

  const filtered = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase());
    const matchCity = !selectedCity || b.city === selectedCity;
    const matchCat = !selectedCat || b.category === selectedCat;
    return matchSearch && matchCity && matchCat;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f0f4f8', minHeight: '100vh' }}>

      {/* HERO SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f4ff 50%, #e8f4fd 100%)', padding: '48px 24px 40px', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          
          {/* LEFT SIDE */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.15 }}>
              Find Trusted<br />
              Businesses <span style={{ color: '#3b82f6' }}>Across India</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>
              Search, discover and connect with verified businesses<br />and professionals in your city.
            </p>

            {/* Search Bar */}
            <div style={{ display: 'flex', gap: 8, background: 'white', borderRadius: 14, padding: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 2, minWidth: 160, padding: '6px 12px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" placeholder="Search business or service..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 14, color: '#0f172a', width: '100%', background: 'transparent' }} />
              </div>
              <div style={{ width: 1, background: '#e2e8f0', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120, padding: '6px 12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 14, color: '#0f172a', background: 'transparent', cursor: 'pointer' }}>
                  <option value="">All India</option>
                  {['Mumbai','Delhi','Pune','Chennai','Bangalore','Kolkata','Jaipur','Hyderabad'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ width: 1, background: '#e2e8f0', margin: '4px 0' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120, padding: '6px 12px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: 14, color: '#0f172a', background: 'transparent', cursor: 'pointer' }}>
                  <option value="">All Categories</option>
                  {['Real Estate','Doctor','Dentist','Restaurant','Retail','Consultant'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: '🛡️', text: 'Verified Businesses' },
                { icon: '📞', text: 'Direct Contact' },
                { icon: '✅', text: '100% Trusted' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569', fontWeight: 500 }}>
                  <span>{b.icon}</span><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - India Map + Floating Card */}
          <div style={{ position: 'relative', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            <svg viewBox="0 0 500 350" style={{ width: '95%', position: 'absolute', bottom: 0, opacity: 0.12 }} fill="#3b82f6" xmlns="http://www.w3.org/2000/svg">
              <rect x="200" y="200" width="100" height="80" rx="2"/>
              <ellipse cx="250" cy="200" rx="30" ry="40"/>
              <ellipse cx="210" cy="210" rx="15" ry="20"/>
              <ellipse cx="290" cy="210" rx="15" ry="20"/>
              <rect x="230" y="160" width="40" height="20"/>
              <polygon points="250,140 240,160 260,160"/>
              <rect x="175" y="195" width="12" height="60"/>
              <ellipse cx="181" cy="193" rx="8" ry="12"/>
              <polygon points="181,178 176,193 186,193"/>
              <rect x="313" y="195" width="12" height="60"/>
              <ellipse cx="319" cy="193" rx="8" ry="12"/>
              <polygon points="319,178 314,193 324,193"/>
              <rect x="160" y="278" width="180" height="10" rx="2"/>
              <rect x="150" y="286" width="200" height="8" rx="2"/>
              <rect x="30" y="180" width="35" height="110"/>
              <rect x="38" y="170" width="20" height="15"/>
              <rect x="44" y="160" width="8" height="12"/>
              <rect x="20" y="210" width="25" height="80"/>
              <rect x="70" y="220" width="30" height="70"/>
              <rect x="75" y="205" width="20" height="18"/>
              <rect x="390" y="190" width="40" height="100"/>
              <rect x="398" y="178" width="24" height="15"/>
              <rect x="404" y="165" width="10" height="16"/>
              <rect x="435" y="215" width="30" height="75"/>
              <rect x="440" y="200" width="20" height="18"/>
              <rect x="355" y="225" width="32" height="65"/>
              <rect x="0" y="288" width="500" height="8" rx="2"/>
              <circle cx="150" cy="150" r="8"/>
              <polygon points="150,165 144,152 156,152"/>
              <circle cx="350" cy="130" r="8"/>
              <polygon points="350,145 344,132 356,132"/>
              <circle cx="250" cy="100" r="8"/>
              <polygon points="250,115 244,102 256,102"/>
            </svg>

            {[
              { top: '18%', left: '38%' },
              { top: '28%', left: '62%' },
              { top: '42%', left: '28%' },
              { top: '52%', left: '55%' },
              { top: '65%', left: '42%' },
              { top: '38%', left: '48%' },
            ].map((pos, i) => (
              <div key={i} style={{ position: 'absolute', top: pos.top, left: pos.left, width: 12, height: 12, background: '#3b82f6', borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 0 3px rgba(59,130,246,0.2)', zIndex: 2 }}></div>
            ))}

            <div style={{ position: 'absolute', top: 10, right: 0, background: 'white', borderRadius: 16, padding: '16px', width: 220, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 3 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏠</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Dream Home Realty</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Real Estate Consultant</div>
                  <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span>📍</span> Bangalore, Karnataka
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <StarRating rating={4.8} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>4.8</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>(128)</span>
                <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>✓ Verified</span>
              </div>
              <button style={{ width: '100%', padding: '8px', background: 'white', color: '#3b82f6', border: '1.5px solid #3b82f6', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                View Profile
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '32px 24px', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Browse by Categories</h2>
            <a href="#" style={{ fontSize: 13, color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>View all categories →</a>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {categories.map(cat => (
              <div key={cat.name} onClick={() => setSelectedCat(selectedCat === cat.name ? '' : cat.name)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80, cursor: 'pointer', padding: '12px 8px', borderRadius: 12, background: selectedCat === cat.name ? '#eff6ff' : 'transparent', border: selectedCat === cat.name ? '1.5px solid #3b82f6' : '1.5px solid transparent', transition: 'all 0.2s' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cat.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#374151', textAlign: 'center', whiteSpace: 'nowrap' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED BUSINESSES — JD-inspired rich cards, SmartProfile branding */}
      <section style={{ padding: '40px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>Featured Businesses</h2>
            <a href="#" style={{ fontSize: 13, color: '#3b82f6', fontWeight: 500, textDecoration: 'none' }}>View all businesses →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
            {filtered.map(biz => (
              <div key={biz.username} onClick={() => router.push('/' + biz.username)}
                style={{ background: 'white', borderRadius: 16, padding: '18px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}>

                {/* Header: big photo + name + rating badge */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                  {biz.img ? (
                    <img src={biz.img} alt={biz.name} style={{ width: 92, height: 92, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: '1px solid #f1f5f9' }} />
                  ) : (
                    <div style={{ width: 92, height: 92, borderRadius: 14, background: `linear-gradient(135deg, ${biz.color}25, ${biz.color}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${biz.color}20` }}>
                      <span style={{ fontWeight: 800, color: biz.color, fontSize: 26 }}>{biz.initials}</span>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{biz.name}</div>
                      {biz.verified && (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 2l2.4 2.4 3.4-.4.4 3.4L21 10l-2.8 2.6.4 3.4-3.4-.4L12 18l-2.4-2.4-3.4.4-.4-3.4L3 10l2.8-2.6-.4-3.4 3.4.4L12 2z"/><path d="M9.5 12l1.8 1.8 3.2-3.6" stroke="white" strokeWidth="1.5" fill="none"/></svg>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{biz.category}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      📍 {[biz.city, biz.state].filter(Boolean).join(', ') || 'India'}
                    </div>
                  </div>
                </div>

                {/* Rating badge — JD-style green pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  {biz.reviews > 0 ? (
                    <>
                      <span style={{ background: '#16a34a', color: 'white', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        {biz.rating.toFixed(1)} ★
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{biz.reviews} Ratings</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No reviews yet</span>
                  )}
                </div>

                {/* Service tags — JD-style chips */}
                {biz.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {biz.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: 11, color: '#334155', background: '#f1f5f9', padding: '4px 9px', borderRadius: 999, fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Buttons: Call + WhatsApp — card itself is clickable for full profile, no separate button needed */}
                <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                  {biz.phone ? (
                    <>
                      <a href={`tel:+${biz.phone}`} style={{ flex: 1, padding: '10px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        📞 Call
                      </a>
                      <a href={`https://wa.me/${biz.phone}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '10px', background: 'white', color: '#16a34a', border: '1.5px solid #16a34a', borderRadius: 9, fontSize: 13, fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        WhatsApp
                      </a>
                    </>
                  ) : (
                    <button onClick={() => router.push('/' + biz.username)} style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                      View Profile →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: 'white', padding: '32px 24px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24, textAlign: 'center' }}>
          {[
            { icon: '🛡️', num: '25,000+', label: 'Verified Businesses' },
            { icon: '🏙️', num: '500+', label: 'Cities Covered' },
            { icon: '📋', num: '100+', label: 'Business Categories' },
            { icon: '🔍', num: '1L+', label: 'Monthly Searches' },
            { icon: '⭐', num: '4.7/5', label: 'Average Rating' },
            { icon: '🎧', num: '24/7', label: 'Customer Support' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{s.num}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 48 }}>🏪</div>
            <div>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: 22, margin: '0 0 6px' }}>Are you a business owner?</h3>
              <p style={{ color: '#bfdbfe', fontSize: 14, margin: 0 }}>Create your digital profile and get discovered by thousands of potential customers across India.</p>
            </div>
          </div>
          <Link href="/register" style={{ display: 'inline-block', padding: '14px 32px', background: 'white', color: '#1e40af', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            List Your Business Free →
          </Link>
        </div>
      </section>

    </div>
  );
}