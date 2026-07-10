'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

const PLAN_LABELS = { basic: 'Basic ₹199', business: 'Business ₹399', premium: 'Premium ₹599', pro: 'Pro ₹999' };
const PLAN_FEATURES = {
  basic: ['logo','name','phone','whatsapp','email','website','vcf','qr','about'],
  business: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social'],
  premium: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social'],
  pro: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social'],
};

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', color: '#1877F2', match: 'facebook' },
  { key: 'instagram', label: 'Instagram', color: '#E4405F', match: 'instagram' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000', match: 'youtube' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', match: 'linkedin' },
  { key: 'twitter', label: 'Twitter/X', color: '#000000', match: 'twitter' },
];

function SocialIcon({ platformKey }) {
  const common = "w-5 h-5";
  if (platformKey === "facebook") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>;
  if (platformKey === "instagram") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.163 6.163 0 100 12.326 6.163 6.163 0 000-12.326zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (platformKey === "youtube") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (platformKey === "linkedin") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556v11.452z"/></svg>;
  if (platformKey === "twitter") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  return <span className="text-white text-xs font-bold">?</span>;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [username, setUsername] = useState('');
  const [plan, setPlan] = useState('basic');
  const [email, setEmail] = useState('');

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [form, setForm] = useState({
    full_name: '', designation: '', business_name: '', tagline: '', category: '',
    city: '', state: '', phone: '', whatsapp: '', website: '', about: '', address: '', maps_url: '',
    facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '',
    video_url: '', brochure_url: '',
  });

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const loadProfile = async () => {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!p) { setNotFound(true); setLoadingData(false); return; }

    setUsername(p.username);
    setPlan(p.plan || 'basic');
    setEmail(p.email || session.user.email || '');
    setLogoPreview(p.logo_url || null);
    setBannerPreview(p.banner_url || null);

    const { data: socialRows } = await supabase
      .from('social_links')
      .select('*')
      .eq('profile_id', p.id);

    const socialValues = {};
    SOCIALS.forEach(s => {
      const row = (socialRows || []).find(r => (r.platform || '').toLowerCase() === s.match);
      socialValues[s.key] = row ? row.url : '';
    });

    setForm({
      full_name: p.full_name || '', designation: p.designation || '', business_name: p.business_name || '',
      tagline: p.tagline || '', category: p.category || '', city: p.city || '', state: p.state || '',
      phone: p.phone || '', whatsapp: p.whatsapp || '', website: p.website || '', about: p.about || '',
      address: p.address || '', maps_url: p.maps_url || '',
      video_url: p.video_url || '', brochure_url: p.brochure_url || '',
      ...socialValues,
    });

    setLoadingData(false);
  };

  useEffect(() => {
    if (status !== 'authenticated') return;
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  if (status === 'loading' || loadingData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-blue-600 text-lg font-semibold animate-pulse">Loading your profile...</div>
    </div>
  );
  if (status === 'unauthenticated') { router.push('/login'); return null; }
  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-700">No profile found</h1>
        <a href="/dashboard/create-profile" className="text-blue-600 text-sm mt-2 inline-block">Create your profile →</a>
      </div>
    </div>
  );

  const has = (f) => (PLAN_FEATURES[plan] || PLAN_FEATURES.basic).includes(f);

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo') { setLogoPreview(url); setLogoFile(file); }
    else { setBannerPreview(url); setBannerFile(file); }
  };

  const uploadImage = async (file, folder) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url;
  };

  const handleSave = async () => {
    if (!form.full_name || !form.business_name || !form.phone) {
      setError('Full Name, Business Name aur Phone required!'); return;
    }
    setSaving(true); setError(''); setSuccess(false);
    try {
      let logo_url = logoPreview && !logoFile ? logoPreview : null;
      let banner_url = bannerPreview && !bannerFile ? bannerPreview : null;
      if (logoFile) logo_url = await uploadImage(logoFile, 'logos');
      if (bannerFile) banner_url = await uploadImage(bannerFile, 'banners');

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, logo_url, banner_url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Update failed'); setSaving(false); return; }

      setSuccess(true);
      setLogoFile(null); setBannerFile(null);
      setMode('view');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50';
  const lbl = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';

  const Lock = ({ need, children }) => (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="blur-sm pointer-events-none select-none opacity-50">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-2xl">
        <div className="text-4xl mb-2">🔒</div>
        <p className="font-bold text-gray-800 text-sm">Upgrade to <span className="text-blue-600">{need}</span></p>
        <a href="/dashboard/upgrade-plan" className="mt-2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold">Upgrade Plan →</a>
      </div>
    </div>
  );

  // ---------- VIEW MODE ----------
  if (mode === 'view') {
    const Row = ({ label, value }) => value ? (
      <div className="py-2 border-b border-gray-100 last:border-0">
        <p className={lbl}>{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    ) : null;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-800">👤 My Profile</h1>
          <a href="/dashboard" className="text-sm text-blue-600">← Back to Dashboard</a>
        </div>

        <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
          {success && <div className="bg-green-50 border border-green-300 text-green-700 rounded-xl p-3 text-sm flex items-center justify-between">
            <span>✅ Profile updated successfully!</span>
            <a href={`/${username}`} className="text-green-800 font-semibold underline">View Live →</a>
          </div>}

          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover"/> : <span className="text-3xl">🏢</span>}
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-lg font-bold text-gray-900">{form.business_name || 'Your Business'}</h2>
              <p className="text-sm text-gray-500">{form.full_name}{form.designation ? ` · ${form.designation}` : ''}</p>
              <p className="text-sm text-blue-600 font-medium mt-1">smartprofile.in/{username}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{PLAN_LABELS[plan] || plan}</span>
              <button onClick={() => setMode('edit')} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700">
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">📋 Basic Info</h3>
            <Row label="Tagline" value={form.tagline} />
            <Row label="Category" value={form.category} />
            <Row label="City / State" value={[form.city, form.state].filter(Boolean).join(', ')} />
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">📞 Contact</h3>
            <Row label="Phone" value={form.phone} />
            <Row label="WhatsApp" value={form.whatsapp} />
            <Row label="Email (contact support to change)" value={email} />
            <Row label="Website" value={form.website} />
          </div>

          {has('about') && (form.about || form.address || bannerPreview) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">📍 About & Address</h3>
              {bannerPreview && <img src={bannerPreview} className="w-full h-28 object-cover rounded-xl mb-3" />}
              <Row label="About Us" value={form.about} />
              <Row label="Address" value={form.address} />
              <Row label="Google Maps URL" value={form.maps_url} />
            </div>
          )}

          {has('social') && SOCIALS.some(s => form[s.key]) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">🔗 Social Media</h3>
              <div className="flex gap-3 flex-wrap">
                {SOCIALS.filter(s => form[s.key]).map(s => (
                  <a key={s.key} href={form[s.key]} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: s.color }}>
                      <SocialIcon platformKey={s.key} />
                    </div>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pb-8" />
        </div>
      </div>
    );
  }

  // ---------- EDIT MODE ----------
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-bold text-gray-800">✏️ Edit My Profile</h1>
        <button onClick={() => setMode('view')} className="text-sm text-blue-600">← Cancel / Back to View</button>
      </div>

      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        {error && <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl p-3 text-sm">{error}</div>}

        {/* Locked info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className={lbl}>Profile URL</p>
            <p className="text-sm font-semibold text-gray-800">smartprofile.in/{username}</p>
          </div>
          <div>
            <p className={lbl}>Email (contact support to change)</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          <div>
            <p className={lbl}>Current Plan</p>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{PLAN_LABELS[plan] || plan}</span>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">📋 Basic Info</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Full Name *</label><input value={form.full_name} onChange={e=>update('full_name',e.target.value)} className={inp}/></div>
              <div><label className={lbl}>Designation</label><input value={form.designation} onChange={e=>update('designation',e.target.value)} className={inp}/></div>
            </div>
            <div><label className={lbl}>Business Name *</label><input value={form.business_name} onChange={e=>update('business_name',e.target.value)} className={inp}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Tagline</label><input value={form.tagline} onChange={e=>update('tagline',e.target.value)} className={inp}/></div>
              <div><label className={lbl}>Category</label><input value={form.category} onChange={e=>update('category',e.target.value)} className={inp}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>City</label><input value={form.city} onChange={e=>update('city',e.target.value)} className={inp}/></div>
              <div><label className={lbl}>State</label><input value={form.state} onChange={e=>update('state',e.target.value)} className={inp}/></div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">📷 Logo / Photo</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover"/> : <span className="text-3xl">🏢</span>}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={e=>handleImage(e,'logo')} className="hidden" id="logo-up"/>
              <label htmlFor="logo-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 {logoPreview ? 'Change Logo' : 'Upload Logo'}</label>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">📞 Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Phone *</label><input value={form.phone} onChange={e=>update('phone',e.target.value)} className={inp}/></div>
            <div><label className={lbl}>WhatsApp</label><input value={form.whatsapp} onChange={e=>update('whatsapp',e.target.value)} className={inp}/></div>
            <div><label className={lbl}>Website</label><input value={form.website} onChange={e=>update('website',e.target.value)} className={inp}/></div>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">🖼️ Cover Banner</h2>
          {!has('banner') ? <Lock need="Business ₹399"><div className="h-28 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl"/></Lock> : (
            <>
              <div className="w-full h-28 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden mb-3 flex items-center justify-center">
                {bannerPreview ? <img src={bannerPreview} className="w-full h-full object-cover"/> : <span className="text-gray-400 text-sm">Upload banner image</span>}
              </div>
              <input type="file" accept="image/*" onChange={e=>handleImage(e,'banner')} className="hidden" id="banner-up"/>
              <label htmlFor="banner-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 {bannerPreview ? 'Change Banner' : 'Upload Banner'}</label>
            </>
          )}
        </div>

        {/* About & Address */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">📍 About & Address</h2>
          {!has('about') ? <Lock need="Business ₹399"><div className="space-y-3"><div className="h-20 bg-gray-100 rounded-xl"/><div className="h-12 bg-gray-100 rounded-xl"/></div></Lock> : (
            <div className="space-y-3">
              <div><label className={lbl}>About Us</label><textarea value={form.about} onChange={e=>update('about',e.target.value)} rows={3} className={inp+' resize-none'}/></div>
              <div><label className={lbl}>Address</label><input value={form.address} onChange={e=>update('address',e.target.value)} className={inp}/></div>
              <div><label className={lbl}>Google Maps URL</label><input value={form.maps_url} onChange={e=>update('maps_url',e.target.value)} className={inp}/></div>
            </div>
          )}
        </div>

        {/* Social */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">🔗 Social Media</h2>
          {!has('social') ? <Lock need="Business ₹399"><div className="space-y-2">{SOCIALS.map(s=><div key={s.key} className="h-12 bg-gray-100 rounded-xl"/>)}</div></Lock> : (
            <div className="space-y-3">
              {SOCIALS.map(s=>(
                <div key={s.key} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{backgroundColor:s.color}}><SocialIcon platformKey={s.key} /></div>
                  <input value={form[s.key]||''} onChange={e=>update(s.key,e.target.value)} placeholder={`${s.label} URL`} className={inp}/>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-lg hover:opacity-90 shadow-lg mb-8 disabled:opacity-60">
          {saving ? '⏳ Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
}