'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

const PLAN_LABELS = { basic: 'Basic', business: 'Business', premium: 'Premium', pro: 'Pro' };
const PLAN_PRICES = { basic: '₹199', business: '₹399', premium: '₹599', pro: '₹999' };
const PLAN_FEATURES = {
  basic: ['logo','name','phone','whatsapp','email','website','vcf','qr','about'],
  business: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social'],
  premium: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social'],
  pro: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social'],
};
const GALLERY_LIMITS = { basic: 0, business: 0, premium: 10, pro: 20 };
const PRODUCT_LIMITS = { basic: 0, business: 2, premium: 5, pro: 10 };

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', color: '#1877F2', match: 'facebook' },
  { key: 'instagram', label: 'Instagram', color: '#E4405F', match: 'instagram' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000', match: 'youtube' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', match: 'linkedin' },
  { key: 'twitter', label: 'Twitter/X', color: '#000000', match: 'twitter' },
];

const BIZ_PLATFORMS = [
  { key: 'google', label: 'Google Business', color: '#4285F4', match: 'google business' },
  { key: 'indiamart', label: 'IndiaMART', color: '#ef4444', match: 'indiamart' },
  { key: 'justdial', label: 'JustDial', color: '#ff6600', match: 'justdial' },
  { key: 'tradeindia', label: 'TradeIndia', color: '#0066cc', match: 'tradeindia' },
  { key: 'exportersindia', label: 'ExportersIndia', color: '#009900', match: 'exportersindia' },
  { key: 'alibaba', label: 'Alibaba', color: '#ff6a00', match: 'alibaba' },
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

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50';
const lbl = 'block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide';
const sizeHint = 'text-[11px] text-gray-400 mt-2';

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mode, setMode] = useState('view');
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
  const [directoryImagePreview, setDirectoryImagePreview] = useState(null);
  const [directoryImageFile, setDirectoryImageFile] = useState(null);

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [productItems, setProductItems] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [newProductImagePreview, setNewProductImagePreview] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [form, setForm] = useState({
    full_name: '', designation: '', business_name: '', tagline: '', category: '',
    area: '', pincode: '', city: '', state: '', phone: '', whatsapp: '', website: '', about: '', address: '', maps_url: '',
    facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '',
    google: '', indiamart: '', justdial: '', tradeindia: '', exportersindia: '', alibaba: '',
    video_url: '', brochure_url: '',
  });

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Looks up City/State from a 6-digit Indian PIN code using the free
  // India Post API. Fires when the pincode field loses focus. City/State
  // stay editable afterwards in case the lookup is wrong or incomplete.
  const handlePincodeBlur = async () => {
    const pin = (form.pincode || '').trim();
    setPincodeError('');
    if (!/^\d{6}$/.test(pin)) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const po = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status === 'Success' && po) {
        setForm(p => ({
          ...p,
          city: po.District || p.city,
          state: po.State || p.state,
        }));
      } else {
        setPincodeError('Pincode not found — please fill City/State manually.');
      }
    } catch {
      setPincodeError('Could not look up pincode — please fill City/State manually.');
    } finally {
      setPincodeLoading(false);
    }
  };

  const DRAFT_KEY = 'smartprofile_edit_draft';

  useEffect(() => {
    if (loadingData) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch (e) {}
  }, [form, loadingData]);

  const [profileId, setProfileId] = useState(null);

  const loadProfile = async () => {
    const { data: p } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!p) { setNotFound(true); setLoadingData(false); return; }

    setProfileId(p.id);
    setUsername(p.username);
    setPlan(p.plan || 'basic');
    setEmail(p.email || session.user.email || '');
    setLogoPreview(p.logo_url || null);
    setBannerPreview(p.banner_url || null);
    setDirectoryImagePreview(p.directory_image_url || null);

    const { data: socialRows } = await supabase.from('social_links').select('*').eq('profile_id', p.id);
    const socialValues = {};
    SOCIALS.forEach(s => {
      const row = (socialRows || []).find(r => (r.platform || '').toLowerCase() === s.match);
      socialValues[s.key] = row ? row.url : '';
    });

    let bizRows = [];
    try {
      const { data } = await supabase.from('business_presence').select('*').eq('profile_id', p.id);
      bizRows = data || [];
    } catch (e) { bizRows = []; }
    const bizValues = {};
    BIZ_PLATFORMS.forEach(b => {
      const row = bizRows.find(r => (r.platform || '').toLowerCase() === b.match);
      bizValues[b.key] = row ? row.url : '';
    });

    let restoredForm = {
      full_name: p.full_name || '', designation: p.designation || '', business_name: p.business_name || '',
      tagline: p.tagline || '', category: p.category || '', area: p.area || '', pincode: p.pincode || '', city: p.city || '', state: p.state || '',
      phone: p.phone || '', whatsapp: p.whatsapp || '', website: p.website || '', about: p.about || '',
      address: p.address || '', maps_url: p.maps_url || '',
      video_url: p.video_url || '', brochure_url: p.brochure_url || '',
      ...socialValues,
      ...bizValues,
    };
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) restoredForm = { ...restoredForm, ...JSON.parse(savedDraft) };
    } catch (e) {}
    setForm(restoredForm);

    try {
      const { data: galleryRows } = await supabase.from('gallery').select('*').eq('profile_id', p.id).order('created_at', { ascending: true });
      setGalleryItems(galleryRows || []);
    } catch (e) { setGalleryItems([]); }

    try {
      const { data: productRows } = await supabase.from('products').select('*').eq('profile_id', p.id).order('created_at', { ascending: true });
      setProductItems(productRows || []);
    } catch (e) { setProductItems([]); }

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
  const maxGallery = GALLERY_LIMITS[plan] || 0;
  const maxProducts = PRODUCT_LIMITS[plan] || 0;

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo') { setLogoPreview(url); setLogoFile(file); }
    else if (type === 'directory') { setDirectoryImagePreview(url); setDirectoryImageFile(file); }
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
      let directory_image_url = directoryImagePreview && !directoryImageFile ? directoryImagePreview : null;
      if (logoFile) logo_url = await uploadImage(logoFile, 'logos');
      if (bannerFile) banner_url = await uploadImage(bannerFile, 'banners');
      if (directoryImageFile) directory_image_url = await uploadImage(directoryImageFile, 'directory');

      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, logo_url, banner_url, directory_image_url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Update failed'); setSaving(false); return; }

      setSuccess(true);
      setLogoFile(null); setBannerFile(null); setDirectoryImageFile(null);
      localStorage.removeItem(DRAFT_KEY);
      setMode('view');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // ---- Gallery handlers ----
  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (galleryItems.length >= maxGallery) { setError(`Gallery limit reached (${maxGallery} photos on your plan)`); return; }
    setGalleryUploading(true); setError('');
    try {
      const image_url = await uploadImage(file, 'gallery');
      const res = await fetch('/api/profile/gallery', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Upload failed'); setGalleryUploading(false); return; }
      setGalleryItems(prev => [...prev, data.item]);
    } catch {
      setError('Gallery upload failed.');
    } finally {
      setGalleryUploading(false);
      e.target.value = '';
    }
  };

  const handleGalleryDelete = async (id) => {
    try {
      await fetch('/api/profile/gallery', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setGalleryItems(prev => prev.filter(g => g.id !== id));
    } catch {
      setError('Could not delete photo.');
    }
  };

  // ---- Product handlers ----
  const handleAddProduct = async () => {
    if (!newProduct.name) { setError('Product name required.'); return; }
    if (productItems.length >= maxProducts) { setError(`Product limit reached (${maxProducts} products on your plan)`); return; }
    setAddingProduct(true); setError('');
    try {
      let image_url = null;
      if (newProductImageFile) image_url = await uploadImage(newProductImageFile, 'products');

      const res = await fetch('/api/profile/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, image_url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Could not add product'); setAddingProduct(false); return; }
      setProductItems(prev => [...prev, data.item]);
      setNewProduct({ name: '', price: '', description: '' });
      setNewProductImageFile(null);
      setNewProductImagePreview(null);
    } catch {
      setError('Could not add product.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleProductImageChange = async (item, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setProductItems(prev => prev.map(p => p.id === item.id ? { ...p, image_url: previewUrl } : p));
    try {
      const image_url = await uploadImage(file, 'products');
      setProductItems(prev => prev.map(p => p.id === item.id ? { ...p, image_url } : p));
      await fetch('/api/profile/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, name: item.name, price: item.price, description: item.description, image_url }),
      });
    } catch {
      setError('Could not upload product image.');
    }
  };

  const handleProductFieldChange = (id, field, value) => {
    setProductItems(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleProductSave = async (item) => {
    try {
      await fetch('/api/profile/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, name: item.name, price: item.price, description: item.description, image_url: item.image_url }),
      });
    } catch {
      setError('Could not save product changes.');
    }
  };

  const handleProductDelete = async (id) => {
    try {
      await fetch('/api/profile/products', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setProductItems(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Could not delete product.');
    }
  };

  const Lock = ({ need, children }) => (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="blur-sm pointer-events-none select-none opacity-50">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-2xl p-4 text-center">
        <div className="text-4xl mb-2">🔒</div>
        <p className="font-bold text-gray-800 text-sm">Upgrade to <span className="text-blue-600">{need}</span></p>
        <a href="/dashboard/upgrade-plan" className="mt-2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold">Upgrade Plan →</a>
      </div>
    </div>
  );

  // ================= VIEW MODE =================
  if (mode === 'view') {
    const Row = ({ label, value }) => value ? (
      <div className="py-2 border-b border-gray-100 last:border-0">
        <p className={lbl}>{label}</p>
        <p className="text-sm text-gray-800 break-words">{value}</p>
      </div>
    ) : null;

    return (
      <div className="min-h-screen bg-gray-100 overflow-x-hidden">
        <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <h1 className="text-lg font-bold text-gray-800">👤 My Profile</h1>
          <a href="/dashboard" className="text-sm text-blue-600">← Back to Dashboard</a>
        </div>

        <div className="max-w-3xl mx-auto px-3 py-4 space-y-4 overflow-x-hidden">
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
              <Row label="Area / Locality" value={form.area} />
              <Row label="Address" value={form.address} />
              <Row label="Google Maps URL" value={form.maps_url} />
            </div>
          )}

          {directoryImagePreview && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">📸 Directory Main Image</h3>
              <img src={directoryImagePreview} className="w-full h-32 object-cover rounded-xl" />
            </div>
          )}

          {galleryItems.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">🖼️ Gallery ({galleryItems.length})</h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryItems.map(g => (
                  <img key={g.id} src={g.image_url} className="w-full h-20 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {productItems.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">📦 Products ({productItems.length})</h3>
              <div className="space-y-2">
                {productItems.map(p => (
                  <div key={p.id} className="flex items-center gap-3 text-sm border-b border-gray-100 last:border-0 py-1.5">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      {p.image_url && <img src={p.image_url} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-gray-800 flex-1">{p.name}</span>
                    {p.price && <span className="text-blue-600 font-semibold">₹{p.price}</span>}
                  </div>
                ))}
              </div>
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

          {has('social') && BIZ_PLATFORMS.some(b => form[b.key]) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">🏢 Business Presence</h3>
              <div className="flex gap-3 flex-wrap">
                {BIZ_PLATFORMS.filter(b => form[b.key]).map(b => (
                  <a key={b.key} href={form[b.key]} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: b.color }}>{b.label.slice(0,2)}</div>
                    <span className="text-xs text-gray-500">{b.label}</span>
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

  // ================= EDIT MODE =================
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-bold text-gray-800">✏️ Edit My Profile</h1>
        <button onClick={() => setMode('view')} className="text-sm text-blue-600">← Cancel / Back to View</button>
      </div>

      <div className="max-w-6xl mx-auto px-3 py-4">
        {error && <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl p-3 text-sm mb-4">{error}</div>}

        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-3 mb-4">
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
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{PLAN_LABELS[plan] || plan} {PLAN_PRICES[plan] || ''}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT COLUMN — existing fields, unchanged */}
          <div className="lg:col-span-2 space-y-4">

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
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">📷 Logo / Photo</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover"/> : <span className="text-3xl">🏢</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={e=>handleImage(e,'logo')} className="hidden" id="logo-up"/>
                  <label htmlFor="logo-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 {logoPreview ? 'Change Logo' : 'Upload Logo'}</label>
                  <p className={sizeHint}>Recommended: 400×400px (square)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">📞 Contact</h2>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Phone *</label><input value={form.phone} onChange={e=>update('phone',e.target.value)} className={inp}/></div>
                <div><label className={lbl}>WhatsApp</label><input value={form.whatsapp} onChange={e=>update('whatsapp',e.target.value)} className={inp}/></div>
                <div><label className={lbl}>Website</label><input value={form.website} onChange={e=>update('website',e.target.value)} className={inp}/></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">🖼️ Cover Banner</h2>
              {!has('banner') ? <Lock need="Business ₹399"><div className="h-28 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl"/></Lock> : (
                <>
                  <div className="w-full h-28 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden mb-3 flex items-center justify-center">
                    {bannerPreview ? <img src={bannerPreview} className="w-full h-full object-cover"/> : <span className="text-gray-400 text-sm">Upload banner image</span>}
                  </div>
                  <input type="file" accept="image/*" onChange={e=>handleImage(e,'banner')} className="hidden" id="banner-up"/>
                  <label htmlFor="banner-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 {bannerPreview ? 'Change Banner' : 'Upload Banner'}</label>
                  <p className={sizeHint}>Recommended: 1200×400px (wide)</p>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">📍 About & Address</h2>
              {!has('about') ? <Lock need="Business ₹399"><div className="space-y-3"><div className="h-20 bg-gray-100 rounded-xl"/><div className="h-12 bg-gray-100 rounded-xl"/></div></Lock> : (
                <div className="space-y-3">
                  <div><label className={lbl}>About Us</label><textarea value={form.about} onChange={e=>update('about',e.target.value)} rows={3} className={inp+' resize-none'}/></div>
                  <div>
                    <label className={lbl}>Area / Locality</label>
                    <input value={form.area} onChange={e=>update('area',e.target.value)} placeholder="e.g. Mira Road" className={inp}/>
                    <p className={sizeHint}>Your neighbourhood — shown before city on the Directory (e.g. "Mira Road, Thane")</p>
                  </div>
                  <div><label className={lbl}>Address</label><input value={form.address} onChange={e=>update('address',e.target.value)} className={inp}/></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={lbl}>Pincode</label>
                      <input value={form.pincode} onChange={e=>update('pincode',e.target.value.replace(/\D/g,'').slice(0,6))} onBlur={handlePincodeBlur} placeholder="e.g. 401107" maxLength={6} className={inp}/>
                    </div>
                    <div>
                      <label className={lbl}>City</label>
                      <input value={form.city} onChange={e=>update('city',e.target.value)} className={inp}/>
                    </div>
                    <div>
                      <label className={lbl}>State</label>
                      <input value={form.state} onChange={e=>update('state',e.target.value)} className={inp}/>
                    </div>
                  </div>
                  {pincodeLoading && <p className="text-xs text-blue-500">Looking up pincode…</p>}
                  {pincodeError && <p className="text-xs text-amber-600">{pincodeError}</p>}
                  <div><label className={lbl}>Google Maps URL</label><input value={form.maps_url} onChange={e=>update('maps_url',e.target.value)} className={inp}/></div>
                </div>
              )}
            </div>

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

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-1">🏢 Business Presence</h2>
              <p className="text-xs text-gray-500 mb-4">Link your listings on other platforms — IndiaMART, JustDial, TradeIndia etc.</p>
              {!has('social') ? <Lock need="Business ₹399"><div className="space-y-2">{BIZ_PLATFORMS.map(b=><div key={b.key} className="h-12 bg-gray-100 rounded-xl"/>)}</div></Lock> : (
                <div className="space-y-3">
                  {BIZ_PLATFORMS.map(b=>(
                    <div key={b.key} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{backgroundColor:b.color}}>{b.label.slice(0,2)}</div>
                      <input value={form[b.key]||''} onChange={e=>update(b.key,e.target.value)} placeholder={`${b.label} URL`} className={inp}/>
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

          {/* RIGHT COLUMN — Directory Image, Gallery, Products */}
          <div className="lg:col-span-1 space-y-4">

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-2">📸 Directory Main Image</h2>
              <p className="text-xs text-gray-500 mb-3">This is the photo customers see first on the Directory listing. Any size works — it auto-adjusts to fit.</p>
              <div className="w-full h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden mb-3 flex items-center justify-center">
                {directoryImagePreview ? <img src={directoryImagePreview} className="w-full h-full object-cover"/> : <span className="text-gray-400 text-sm">Upload directory image</span>}
              </div>
              <input type="file" accept="image/*" onChange={e=>handleImage(e,'directory')} className="hidden" id="directory-img-up"/>
              <label htmlFor="directory-img-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 {directoryImagePreview ? 'Change Image' : 'Upload Image'}</label>
              <p className={sizeHint}>Recommended: 800×600px</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-1">🖼️ Gallery <span className="text-xs text-gray-400 font-normal">({galleryItems.length}/{maxGallery})</span></h2>
              {maxGallery === 0 ? (
                <Lock need="Premium ₹599"><div className="grid grid-cols-3 gap-2 mt-3">{[1,2,3].map(i=><div key={i} className="aspect-square bg-gray-100 rounded-xl"/>)}</div></Lock>
              ) : (
                <>
                  <p className="text-xs text-gray-500 mb-3">Up to {maxGallery} photos, any size (800×800px recommended)</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {galleryItems.map(g => (
                      <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={g.image_url} className="w-full h-full object-cover" />
                        <button onClick={() => handleGalleryDelete(g.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-90">✕</button>
                      </div>
                    ))}
                  </div>
                  {galleryItems.length < maxGallery && (
                    <>
                      <input type="file" accept="image/*" onChange={handleGalleryUpload} className="hidden" id="gallery-up"/>
                      <label htmlFor="gallery-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">
                        {galleryUploading ? '⏳ Uploading...' : '📤 Add Photo'}
                      </label>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-1">📦 Products <span className="text-xs text-gray-400 font-normal">({productItems.length}/{maxProducts})</span></h2>
              {maxProducts === 0 ? (
                <Lock need="Business ₹399"><div className="space-y-2 mt-3"><div className="h-16 bg-gray-100 rounded-xl"/></div></Lock>
              ) : (
                <>
                  <div className="space-y-2 mb-3">
                    {productItems.map(p => (
                      <div key={p.id} className="border border-gray-200 rounded-xl p-3 space-y-2">
                        <div className="flex gap-2">
                          <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover"/> : <span className="text-gray-300 text-xs">No img</span>}
                          </div>
                          <div className="flex-1">
                            <input type="file" accept="image/*" onChange={e=>handleProductImageChange(p, e.target.files[0])} className="hidden" id={`product-img-${p.id}`}/>
                            <label htmlFor={`product-img-${p.id}`} className="cursor-pointer text-xs text-blue-600 font-semibold">📤 {p.image_url ? 'Change photo' : 'Add photo'}</label>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input value={p.name || ''} onChange={e=>handleProductFieldChange(p.id,'name',e.target.value)} onBlur={()=>handleProductSave(p)} placeholder="Product name" className={inp}/>
                          <input value={p.price || ''} onChange={e=>handleProductFieldChange(p.id,'price',e.target.value)} onBlur={()=>handleProductSave(p)} placeholder="Price (₹)" className={inp}/>
                        </div>
                        <div className="flex gap-2">
                          <input value={p.description || ''} onChange={e=>handleProductFieldChange(p.id,'description',e.target.value)} onBlur={()=>handleProductSave(p)} placeholder="Description" className={inp}/>
                          <button onClick={() => handleProductDelete(p.id)} className="text-red-500 text-xs px-2 flex-shrink-0">✕ Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {productItems.length < maxProducts && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 space-y-2">
                      <div className="flex gap-2 items-center">
                        <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {newProductImagePreview ? <img src={newProductImagePreview} className="w-full h-full object-cover"/> : <span className="text-gray-300 text-xs">No img</span>}
                        </div>
                        <div>
                          <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0]; if(f){setNewProductImageFile(f); setNewProductImagePreview(URL.createObjectURL(f));}}} className="hidden" id="new-product-img"/>
                          <label htmlFor="new-product-img" className="cursor-pointer text-xs text-blue-600 font-semibold">📤 {newProductImagePreview ? 'Change photo' : 'Add photo (optional)'}</label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={newProduct.name} onChange={e=>setNewProduct(p=>({...p,name:e.target.value}))} placeholder="Product name" className={inp}/>
                        <input value={newProduct.price} onChange={e=>setNewProduct(p=>({...p,price:e.target.value}))} placeholder="Price (₹)" className={inp}/>
                      </div>
                      <input value={newProduct.description} onChange={e=>setNewProduct(p=>({...p,description:e.target.value}))} placeholder="Description" className={inp}/>
                      <button onClick={handleAddProduct} disabled={addingProduct}
                        className="w-full border-2 border-dashed border-blue-300 text-blue-600 rounded-xl py-2 text-sm font-semibold hover:bg-blue-50">
                        {addingProduct ? '⏳ Adding...' : '+ Add Product'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}