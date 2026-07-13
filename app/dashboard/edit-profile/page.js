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
const GALLERY_LIMITS = { basic: 0, business: 0, premium: 10, pro: 10 };
const PRODUCT_LIMITS = { basic: 0, business: 2, premium: 5, pro: 10 };
const BIZ_LIMITS = { basic: 0, business: 0, premium: 3, pro: 6 };

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', color: '#1877F2', domain: 'facebook.com', match: 'facebook' },
  { key: 'instagram', label: 'Instagram', color: '#E4405F', domain: 'instagram.com', match: 'instagram' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000', domain: 'youtube.com', match: 'youtube' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', domain: 'linkedin.com', match: 'linkedin' },
  { key: 'twitter', label: 'Twitter/X', color: '#000000', domain: 'x.com', match: 'twitter' },
  { key: 'threads', label: 'Threads', color: '#000000', domain: 'threads.net', match: 'threads' },
  { key: 'pinterest', label: 'Pinterest', color: '#E60023', domain: 'pinterest.com', match: 'pinterest' },
  { key: 'telegram', label: 'Telegram', color: '#26A5E4', domain: 'telegram.org', match: 'telegram' },
];

// Business Presence platforms, grouped by category for the dropdown. Each
// item's `domain` is used to fetch a small real favicon via Google's
// favicon service, so every platform shows its actual icon.
const BIZ_CATEGORIES = [
  { category: 'Business Directories', items: [
    { key: 'google', label: 'Google Business Profile', domain: 'business.google.com' },
    { key: 'justdial', label: 'Justdial', domain: 'justdial.com' },
    { key: 'indiamart', label: 'IndiaMART', domain: 'indiamart.com' },
    { key: 'tradeindia', label: 'TradeIndia', domain: 'tradeindia.com' },
    { key: 'exportersindia', label: 'ExportersIndia', domain: 'exportersindia.com' },
    { key: 'sulekha', label: 'Sulekha', domain: 'sulekha.com' },
  ]},
  { category: 'Marketplace / Seller Store', items: [
    { key: 'amazon', label: 'Amazon', domain: 'amazon.in' },
    { key: 'flipkart', label: 'Flipkart', domain: 'flipkart.com' },
    { key: 'meesho', label: 'Meesho', domain: 'meesho.com' },
    { key: 'jiomart', label: 'JioMart', domain: 'jiomart.com' },
  ]},
  { category: 'Quick Commerce', items: [
    { key: 'blinkit', label: 'Blinkit', domain: 'blinkit.com' },
    { key: 'zepto', label: 'Zepto', domain: 'zeptonow.com' },
    { key: 'instamart', label: 'Swiggy Instamart', domain: 'swiggy.com' },
  ]},
  { category: 'Food Delivery', items: [
    { key: 'zomato', label: 'Zomato', domain: 'zomato.com' },
    { key: 'swiggy', label: 'Swiggy', domain: 'swiggy.com' },
    { key: 'magicpin', label: 'Magicpin', domain: 'magicpin.in' },
  ]},
  { category: 'Real Estate', items: [
    { key: 'magicbricks', label: 'MagicBricks', domain: 'magicbricks.com' },
    { key: '99acres', label: '99acres', domain: '99acres.com' },
    { key: 'housing', label: 'Housing.com', domain: 'housing.com' },
    { key: 'nobroker', label: 'NoBroker', domain: 'nobroker.in' },
  ]},
  { category: 'Healthcare', items: [
    { key: 'practo', label: 'Practo', domain: 'practo.com' },
    { key: 'apollo247', label: 'Apollo 24/7', domain: 'apollo247.com' },
  ]},
  { category: 'Jobs', items: [
    { key: 'naukri', label: 'Naukri', domain: 'naukri.com' },
    { key: 'apna', label: 'Apna', domain: 'apna.co' },
    { key: 'indeed', label: 'Indeed', domain: 'indeed.com' },
  ]},
  { category: 'B2B Export', items: [
    { key: 'alibaba', label: 'Alibaba', domain: 'alibaba.com' },
    { key: 'globalsources', label: 'Global Sources', domain: 'globalsources.com' },
    { key: 'tradewheel', label: 'TradeWheel', domain: 'tradewheel.com' },
  ]},
];
const BIZ_PLATFORMS = BIZ_CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, category: c.category })));

// Fetches each platform's real small icon via Google's public favicon
// service, keyed by domain.
function PlatformIcon({ domain }) {
  if (!domain) return <span className="text-gray-400 text-xs font-bold">?</span>;
  return <img src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`} alt="" className="w-5 h-5 rounded-sm" />;
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
  const [customerId, setCustomerId] = useState(null);

  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [directoryImagePreview, setDirectoryImagePreview] = useState(null);
  const [directoryImageFile, setDirectoryImageFile] = useState(null);

  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [productItems, setProductItems] = useState([]);
  const [bizPresence, setBizPresence] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [newProductImagePreview, setNewProductImagePreview] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  const [form, setForm] = useState({
    full_name: '', designation: '', business_name: '', tagline: '', category: '',
    display_as: 'business', area: '', pincode: '', city: '', state: '', phone: '', whatsapp: '', website: '', about: '', address: '', maps_url: '',
    video_url: '', brochure_url: '',
    facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '', threads: '', pinterest: '', telegram: '',
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

    const { data: userRow } = await supabase.from('users').select('customer_id').eq('id', session.user.id).single();
    if (userRow?.customer_id) setCustomerId(userRow.customer_id);

    const { data: socialRows } = await supabase.from('social_links').select('*').eq('profile_id', p.id);
    const socialValues = {};
    SOCIALS.forEach(s => {
      const row = (socialRows || []).find(r => (r.platform || '').toLowerCase().includes(s.match));
      socialValues[s.key] = row ? row.url : '';
    });

    let bizRows = [];
    try {
      const { data } = await supabase.from('business_presence').select('*').eq('profile_id', p.id);
      bizRows = data || [];
    } catch (e) { bizRows = []; }
    setBizPresence(bizRows.map(r => ({ platform: r.platform || '', url: r.url || '' })));

    let restoredForm = {
      full_name: p.full_name || '', designation: p.designation || '', business_name: p.business_name || '',
      tagline: p.tagline || '', category: p.category || '', display_as: p.display_as || 'business', area: p.area || '', pincode: p.pincode || '', city: p.city || '', state: p.state || '',
      phone: p.phone || '', whatsapp: p.whatsapp || '', website: p.website || '', about: p.about || '',
      address: p.address || '', maps_url: p.maps_url || '',
      video_url: p.video_url || '', brochure_url: p.brochure_url || '',
      ...socialValues,
    };
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        // Only bring over fields that actually have a non-empty value in the
        // draft. A stale/blank draft (e.g. saved from a session where fields
        // were left empty) must never overwrite real data just loaded from
        // the database.
        const nonEmptyDraft = Object.fromEntries(
          Object.entries(draft).filter(([, v]) => v !== '' && v !== null && v !== undefined)
        );
        restoredForm = { ...restoredForm, ...nonEmptyDraft };
      }
    } catch (e) {}
    setForm(restoredForm);

    try {
      const { data: galleryRows, error: galleryErr } = await supabase.from('gallery').select('*').eq('profile_id', p.id).order('sort_order', { ascending: true });
      if (galleryErr) throw galleryErr;
      setGalleryItems(galleryRows || []);
    } catch (e) {
      // Fallback: fetch without ordering in case the sort column doesn't exist
      try {
        const { data: galleryRows2 } = await supabase.from('gallery').select('*').eq('profile_id', p.id);
        setGalleryItems(galleryRows2 || []);
      } catch (e2) { setGalleryItems([]); }
    }

    try {
      const { data: productRows, error: productErr } = await supabase.from('products').select('*').eq('profile_id', p.id);
      if (productErr) throw productErr;
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
  const maxBiz = BIZ_LIMITS[plan] || 0;

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
        body: JSON.stringify({ ...form, logo_url, banner_url, directory_image_url, bizPresence }),
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
              {customerId && <p className="text-xs text-gray-400 font-semibold mt-0.5">Customer ID: {customerId}</p>}
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
            <Row label="Digital Card shows" value={form.display_as === 'personal' ? `Personal (${form.full_name})` : `Business (${form.business_name})`} />
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
              <Row label="Area / Locality" value={form.area} />
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
                  <div key={g.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={g.image_url} className="w-full h-full object-contain" />
                  </div>
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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                      <PlatformIcon domain={s.domain} />
                    </div>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {bizPresence.some(b => b.platform && b.url) && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">🏢 Business Presence</h3>
              <div className="flex gap-3 flex-wrap">
                {bizPresence.filter(b => b.platform && b.url).map((b,i) => {
                  const sel = BIZ_PLATFORMS.find(p => p.label === b.platform);
                  return (
                    <a key={i} href={b.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                        {sel ? <PlatformIcon domain={sel.domain} /> : <span className="text-gray-400 text-xs font-bold">?</span>}
                      </div>
                      <span className="text-xs text-gray-500">{b.platform}</span>
                    </a>
                  );
                })}
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
          {customerId && (
            <div>
              <p className={lbl}>Customer ID</p>
              <p className="text-sm font-semibold text-gray-800">{customerId}</p>
            </div>
          )}
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
                <div>
                  <label className={lbl}>This Digital Card is for</label>
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center gap-2 border-[1.5px] rounded-xl px-4 py-3 text-sm cursor-pointer ${form.display_as === 'personal' ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                      <input type="checkbox" checked={form.display_as === 'personal'} onChange={()=>update('display_as','personal')} className="w-4 h-4 accent-blue-600"/>
                      Personal ({form.full_name || 'Your Name'})
                    </label>
                    <label className={`flex-1 flex items-center gap-2 border-[1.5px] rounded-xl px-4 py-3 text-sm cursor-pointer ${form.display_as === 'business' ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                      <input type="checkbox" checked={form.display_as === 'business'} onChange={()=>update('display_as','business')} className="w-4 h-4 accent-blue-600"/>
                      Business ({form.business_name || 'Business Name'})
                    </label>
                  </div>
                  <p className={sizeHint}>Which name shows prominently on your Digital Card. Directory listing always shows Business Name — this only affects the Digital Card.</p>
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
                  <div><label className={lbl}>Address</label><input value={form.address} onChange={e=>update('address',e.target.value)} className={inp}/></div>
                  <div>
                    <label className={lbl}>Area / Locality</label>
                    <input value={form.area} onChange={e=>update('area',e.target.value)} placeholder="e.g. Mira Road" className={inp}/>
                  </div>
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
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200"><PlatformIcon domain={s.domain} /></div>
                      <input value={form[s.key]||''} onChange={e=>update(s.key,e.target.value)} placeholder={`${s.label} URL`} className={inp}/>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-1">🏢 Business Presence <span className="text-xs text-gray-400 font-normal">(max {maxBiz || 0})</span></h2>
              <p className="text-xs text-gray-500 mb-4">Link your listings on other platforms — IndiaMART, JustDial, TradeIndia etc.</p>
              {maxBiz === 0 ? <Lock need="Premium ₹599"><div className="space-y-2">{[1,2,3].map(i=><div key={i} className="h-12 bg-gray-100 rounded-xl"/>)}</div></Lock> : (
                <div className="space-y-3">
                  {bizPresence.slice(0, maxBiz).map((b,i)=>{
                    const selected = BIZ_PLATFORMS.find(p => p.label === b.platform);
                    return (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                        {selected ? <PlatformIcon domain={selected.domain} /> : <span className="text-gray-400 text-xs font-bold">?</span>}
                      </div>
                      <select value={b.platform} onChange={e=>{const n=[...bizPresence];n[i]={...n[i],platform:e.target.value};setBizPresence(n);}} className={inp}>
                        <option value="">Select Platform</option>
                        {BIZ_CATEGORIES.map(cat=>(
                          <optgroup key={cat.category} label={cat.category}>
                            {cat.items.map(item=><option key={item.key} value={item.label}>{item.label}</option>)}
                          </optgroup>
                        ))}
                      </select>
                      <input value={b.url} onChange={e=>{const n=[...bizPresence];n[i]={...n[i],url:e.target.value};setBizPresence(n);}} placeholder="Profile URL" className={inp}/>
                      <button onClick={()=>setBizPresence(bizPresence.filter((_,idx)=>idx!==i))} className="text-red-500 text-xs px-2 flex-shrink-0">✕</button>
                    </div>
                    );
                  })}
                  {bizPresence.length < maxBiz && (
                    <button onClick={()=>setBizPresence([...bizPresence,{platform:'',url:''}])} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-300">+ Add Platform</button>
                  )}
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
              <div className="w-full aspect-square rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden mb-3 flex items-center justify-center">
                {directoryImagePreview ? <img src={directoryImagePreview} className="w-full h-full object-cover"/> : <span className="text-gray-400 text-sm">Upload directory image</span>}
              </div>
              <input type="file" accept="image/*" onChange={e=>handleImage(e,'directory')} className="hidden" id="directory-img-up"/>
              <label htmlFor="directory-img-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 {directoryImagePreview ? 'Change Image' : 'Upload Image'}</label>
              <p className={sizeHint}>Square photo works best (e.g. 800×800px) — it's shown as a square on the Directory. Non-square photos are auto-centred and cropped to fit.</p>
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
                      <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 flex items-center justify-center">
                        <img src={g.image_url} className="w-full h-full object-contain" />
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
                  {productItems.length < maxProducts && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 space-y-2 mb-3">
                      <p className="text-xs font-semibold text-blue-600 mb-1">+ Add New Product / Service</p>
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
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}