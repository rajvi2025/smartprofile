'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

function slugifyCategory(category) {
  return (category || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function titleCaseFromSlug(slug) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function cleanPhone(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length === 10) return '91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

function extractLocation(address, city, state) {
  const cityState = [city, state].filter(Boolean).join(', ');
  if (!address) return cityState || 'India';
  const parts = address.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return cityState || 'India';
  return parts.slice(-3).join(', ') || cityState || 'India';
}

export default function CategoryClient({ categorySlug }) {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [categoryName, setCategoryName] = useState(titleCaseFromSlug(categorySlug));
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function fetchCategoryBusinesses() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true);
      if (error || !data) { setLoading(false); return; }

      const matched = data.filter(p => slugifyCategory(p.category) === categorySlug);
      if (matched.length > 0) setCategoryName(matched[0].category);

      const profileIds = matched.map(p => p.id);
      const { data: allTestimonials } = await supabase
        .from('testimonials')
        .select('profile_id, rating')
        .in('profile_id', profileIds.length ? profileIds : ['00000000-0000-0000-0000-000000000000']);

      const ratingMap = {};
      (allTestimonials || []).forEach(t => {
        if (!ratingMap[t.profile_id]) ratingMap[t.profile_id] = { sum: 0, count: 0 };
        ratingMap[t.profile_id].sum += t.rating || 0;
        ratingMap[t.profile_id].count += 1;
      });

      setBusinesses(matched.map(p => {
        const r = ratingMap[p.id];
        return {
          id: p.id,
          name: p.business_name || p.full_name || p.username,
          category: p.category || 'General',
          city: p.city || '',
          location: extractLocation(p.address, p.city, p.state),
          rating: r ? (r.sum / r.count) : 0,
          reviews: r ? r.count : 0,
          initials: (p.business_name || p.full_name || '?').substring(0, 2).toUpperCase(),
          img: p.directory_image_url || p.banner_url || p.logo_url || null,
          username: p.username,
          phone: cleanPhone(p.phone),
        };
      }));
      setLoading(false);
    }
    fetchCategoryBusinesses();
  }, [categorySlug]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f0f4f8', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 0' }}>
        <nav style={{ fontSize: 13, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/directory" style={{ color: '#64748b', textDecoration: 'none' }}>Directory</Link>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{categoryName}</span>
        </nav>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 8px' }}>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
          {categoryName}
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
          {loading ? 'Loading businesses...' : `${businesses.length} verified business${businesses.length === 1 ? '' : 'es'} found in ${categoryName}`}
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 48px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>Loading...</div>
        ) : businesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: 16, border: '1px dashed #e2e8f0' }}>
            <p style={{ color: '#64748b', fontSize: 15, marginBottom: 16 }}>No businesses listed in {categoryName} yet.</p>
            <Link href="/register" style={{ display: 'inline-block', padding: '10px 24px', background: '#3b82f6', color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              List Your Business →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
            {businesses.map((biz) => (
              <div key={biz.username} onClick={() => router.push(`/directory/${slugifyCity(biz.city)}/${biz.username}`)}
                style={{ background: 'white', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'row', minHeight: isMobile ? 'auto' : 200 }}>

                <div style={{ width: isMobile ? '44%' : '42%', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: 14, alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                    {biz.img ? (
                      <Image src={biz.img} alt={biz.name} fill sizes="(max-width: 768px) 44vw, 280px" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #3b82f625, #3b82f610)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 800, color: '#3b82f6', fontSize: 28 }}>{biz.initials}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ width: isMobile ? '56%' : '58%', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{biz.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{biz.category}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>📍 {biz.location}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      {biz.reviews > 0 ? (
                        <>
                          <span style={{ background: '#16a34a', color: 'white', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                            {biz.rating.toFixed(1)} ★
                          </span>
                          <span style={{ fontSize: 12, color: '#64748b' }}>{biz.reviews} Ratings</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No reviews yet</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: biz.phone ? '1fr 1fr' : '1fr', gap: 8, marginTop: 12 }} onClick={e => e.stopPropagation()}>
                    {biz.phone ? (
                      <>
                        <a href={`tel:+${biz.phone}`} style={{ padding: '9px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                          📞 Call
                        </a>
                        <a href={`https://wa.me/${biz.phone}`} target="_blank" rel="noopener noreferrer" style={{ padding: '9px', background: 'white', color: '#16a34a', border: '1.5px solid #16a34a', borderRadius: 9, fontSize: 12, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                          WhatsApp
                        </a>
                      </>
                    ) : (
                      <button onClick={() => router.push(`/directory/${slugifyCity(biz.city)}/${biz.username}`)} style={{ padding: '9px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        View Profile →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}