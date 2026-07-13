'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

const PLANS = [
  { id: 'basic', name: 'Basic', price: '₹199', amount: 199, color: 'bg-green-500', border: 'border-green-500', features: ['logo','name','phone','whatsapp','email','website','vcf','qr','about'] },
  { id: 'business', name: 'Business', price: '₹399', amount: 399, color: 'bg-blue-600', border: 'border-blue-600', features: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social','products','services','testimonials'] },
  { id: 'premium', name: 'Premium', price: '₹599', amount: 599, color: 'bg-orange-500', border: 'border-orange-500', features: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social','products','services','testimonials','gallery','brochure','biz_presence'] },
  { id: 'pro', name: 'Pro', price: '₹999', amount: 999, color: 'bg-purple-600', border: 'border-purple-600', features: ['logo','name','phone','whatsapp','email','website','vcf','qr','about','banner','address','maps','social','products','services','testimonials','gallery','brochure','biz_presence','lead_form','verified','video','analytics'] },
];

const THEMES = [
  { id: 'ocean', name: 'Ocean', bg: 'from-blue-800 to-cyan-500', accent: '#1e40af' },
  { id: 'sunset', name: 'Sunset', bg: 'from-orange-600 to-pink-500', accent: '#ea580c' },
  { id: 'forest', name: 'Forest', bg: 'from-green-700 to-teal-500', accent: '#15803d' },
  { id: 'royal', name: 'Royal', bg: 'from-purple-700 to-indigo-500', accent: '#7c3aed' },
  { id: 'midnight', name: 'Midnight', bg: 'from-gray-900 to-slate-700', accent: '#334155' },
  { id: 'luxury', name: 'Luxury', bg: 'from-yellow-700 to-amber-500', accent: '#b45309' },
];

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', color: '#E4405F' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000' },
  { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { key: 'twitter', label: 'Twitter/X', color: '#000000' },
];

const BIZ_PLATFORMS = [
  { key: 'google', label: 'Google Business', color: '#4285F4' },
  { key: 'indiamart', label: 'IndiaMART', color: '#ef4444' },
  { key: 'justdial', label: 'JustDial', color: '#ff6600' },
  { key: 'tradeindia', label: 'TradeIndia', color: '#0066cc' },
  { key: 'exportersindia', label: 'ExportersIndia', color: '#009900' },
  { key: 'alibaba', label: 'Alibaba', color: '#ff6a00' },
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

export default function CreateProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [planId, setPlanId] = useState('basic');
  const [theme, setTheme] = useState(THEMES[0]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // ---- Coupon state ----
  const [couponCode, setCouponCode] = useState('');
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { id, code, discountAmount }

  const [products, setProducts] = useState([{ name: '', price: '', description: '' }]);
  const [services, setServices] = useState([{ name: '', price: '', description: '' }]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([{ name: '', rating: 5, text: '' }]);
  const [bizPresence, setBizPresence] = useState([{ platform: '', url: '' }]);

  const [form, setForm] = useState({
    username: '', full_name: '', designation: '', business_name: '',
    tagline: '', category: '', phone: '', whatsapp: '', email: '',
    website: '', address: '', city: '', about: '', maps_url: '',
    facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '',
    video_url: '', brochure_url: '',
  });

  const DRAFT_KEY = 'smartprofile_create_draft';

  // Restore any saved draft once, on first load.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.form) setForm(draft.form);
        if (draft.planId) setPlanId(draft.planId);
        if (draft.themeId) {
          const t = THEMES.find(t => t.id === draft.themeId);
          if (t) setTheme(t);
        }
      }
    } catch (e) {
      // corrupted draft — ignore and start fresh
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save the draft (text fields only — images can't be persisted this
  // way, so logo/banner still need re-uploading if a draft is restored)
  // whenever the form, plan, or theme changes.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, planId, themeId: theme.id }));
    } catch (e) {
      // storage full or unavailable — silently skip autosave
    }
  }, [form, planId, theme]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) { router.push('/login'); return null; }

  const plan = PLANS.find(p => p.id === planId);

  // Final payable amount after coupon discount (never below ₹1, Razorpay doesn't allow ₹0 orders)
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = Math.max(1, Math.round((plan.amount - discountAmount) * 100) / 100);

  async function handleApplyCoupon() {
    setCouponError('');
    setAppliedCoupon(null);
    const code = couponCode.trim().toUpperCase();
    if (!code) { setCouponError('Please enter a coupon code.'); return; }

    setCouponChecking(true);
    try {
      const { data: coupon, error: fetchErr } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .single();

      if (fetchErr || !coupon) { setCouponError('This coupon code is not valid.'); setCouponChecking(false); return; }
      if (!coupon.is_active) { setCouponError('This coupon is not active.'); setCouponChecking(false); return; }

      const now = new Date();
      if (coupon.valid_from && new Date(coupon.valid_from) > now) { setCouponError('This coupon is not active yet.'); setCouponChecking(false); return; }
      if (coupon.valid_until && new Date(coupon.valid_until) < now) { setCouponError('This coupon has expired.'); setCouponChecking(false); return; }

      if (coupon.applicable_product && coupon.applicable_product !== 'all' && coupon.applicable_product !== 'digital_card') {
        setCouponError('This coupon is not valid for Digital Card plans.'); setCouponChecking(false); return;
      }
      if (coupon.applicable_plans && coupon.applicable_plans.length > 0 && !coupon.applicable_plans.includes(planId)) {
        setCouponError('This coupon is not valid for this plan.'); setCouponChecking(false); return;
      }
      if (coupon.min_order_value && plan.amount < Number(coupon.min_order_value)) {
        setCouponError(`A minimum order of ₹${coupon.min_order_value} is required for this coupon.`); setCouponChecking(false); return;
      }

      // Usage limit checks
      if (coupon.usage_type === 'single_use' && (coupon.used_count || 0) >= 1) {
        setCouponError('This coupon has already been fully used.'); setCouponChecking(false); return;
      }
      if (coupon.usage_type === 'limited' && coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) {
        setCouponError('This coupon has reached its usage limit.'); setCouponChecking(false); return;
      }

      // Per-user limit check
      const userEmail = form.email || session?.user?.email;
      if (userEmail) {
        const { count: userUseCount } = await supabase
          .from('coupon_redemptions')
          .select('id', { count: 'exact', head: true })
          .eq('coupon_id', coupon.id)
          .eq('email', userEmail);
        if (coupon.per_user_limit && (userUseCount || 0) >= coupon.per_user_limit) {
          setCouponError('You have already used this coupon.'); setCouponChecking(false); return;
        }
      }

      // Calculate discount
      let discount = coupon.type === 'percentage'
        ? (Number(coupon.value) / 100) * plan.amount
        : Number(coupon.value);
      if (coupon.max_discount_cap && discount > Number(coupon.max_discount_cap)) {
        discount = Number(coupon.max_discount_cap);
      }
      discount = Math.min(discount, plan.amount); // never discount more than the order itself
      discount = Math.round(discount * 100) / 100;

      setAppliedCoupon({ id: coupon.id, code: coupon.code, discountAmount: discount });
    } catch {
      setCouponError('Something went wrong. Please try again.');
    }
    setCouponChecking(false);
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  }
  const has = (f) => plan.features.includes(f);
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const maxProducts = planId === 'business' ? 2 : planId === 'premium' ? 5 : planId === 'pro' ? 10 : 0;
  const maxServices = planId === 'business' ? 2 : planId === 'premium' ? 5 : planId === 'pro' ? 10 : 0;
  const maxGallery = planId === 'premium' ? 10 : planId === 'pro' ? 20 : 0;
  const maxTestimonials = planId === 'business' ? 2 : planId === 'premium' ? 5 : planId === 'pro' ? 10 : 0;
  const maxBiz = planId === 'premium' ? 3 : planId === 'pro' ? 6 : 0;

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'logo') { setLogoPreview(url); setLogoFile(file); }
    else { setBannerPreview(url); setBannerFile(file); }
  };

  const handleGallery = (e) => {
    const files = Array.from(e.target.files).slice(0, maxGallery);
    setGallery(files.map(f => ({ file: f, preview: URL.createObjectURL(f) })));
  };

  const uploadImage = async (file, folder) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (paymentDetails) => {
    if (!form.username || !form.business_name || !form.phone) {
      setError('Username, Business Name aur Phone required!'); return;
    }
    setLoading(true); setError('');
    try {
      let logo_url = null, banner_url = null;
      if (logoFile) logo_url = await uploadImage(logoFile, 'logos');
      if (bannerFile) banner_url = await uploadImage(bannerFile, 'banners');

      const res = await fetch('/api/profile/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, theme: theme.id, plan: planId, logo_url, banner_url, amount_paid: finalAmount,
          razorpay_order_id: paymentDetails?.razorpay_order_id || null,
          razorpay_payment_id: paymentDetails?.razorpay_payment_id || null,
          coupon_code: appliedCoupon ? appliedCoupon.code : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error'); setLoading(false); return; }

      const profileId = data.profile.id;

      // Record coupon redemption + bump used_count — only after the profile
      // (and its payments-table row) was actually created successfully.
      if (appliedCoupon) {
        try {
          await supabase.from('coupon_redemptions').insert([{
            coupon_id: appliedCoupon.id,
            profile_id: profileId,
            email: form.email || session?.user?.email,
            order_amount: plan.amount,
            discount_amount: appliedCoupon.discountAmount,
            final_amount: finalAmount,
            razorpay_order_id: paymentDetails?.razorpay_order_id || null,
          }]);
          await supabase.rpc('increment_coupon_usage', { coupon_id_input: appliedCoupon.id });
        } catch {
          // Non-critical — the account/profile already succeeded, don't block the user for this
        }
      }

      if (has('products') && products[0].name) {
        await fetch('/api/profile/sections', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId, type: 'products', items: products.filter(p => p.name) }),
        });
      }
      if (has('services') && services[0].name) {
        await fetch('/api/profile/sections', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId, type: 'services', items: services.filter(s => s.name) }),
        });
      }
      if (has('testimonials') && testimonials[0].name) {
        await fetch('/api/profile/sections', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId, type: 'testimonials', items: testimonials.filter(t => t.name) }),
        });
      }
      if (has('biz_presence') && bizPresence[0].url) {
        await fetch('/api/profile/sections', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId, type: 'biz_presence', items: bizPresence.filter(b => b.url) }),
        });
      }

      localStorage.removeItem(DRAFT_KEY);
      router.push(`/${form.username}`);
    } catch { setError('Network error.'); }
    finally { setLoading(false); }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Payment gateway load nahi hua. Internet check karo aur dobara try karo.');
        setLoading(false);
        return;
      }

      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount, planId: plan.id, username: form.username }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order) {
        setError('Payment start nahi ho paya. Dobara try karo.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'SmartProfile.in',
        description: `${plan.name} Plan — ${form.business_name}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              setShowCheckout(false);
              handleSubmit({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              });
            } else {
              setError('Payment verify nahi ho paya. Agar paisa kata hai toh support se contact karo.');
              setLoading(false);
            }
          } catch {
            setError('Payment verify karte waqt error aaya.');
            setLoading(false);
          }
        },
        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#3b82f6' },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setError('Payment failed: ' + (response.error?.description || 'Try again.'));
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError('Kuch gadbad ho gayi. Dobara try karo.');
      setLoading(false);
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
        <button onClick={() => { const p = PLANS.find(x => x.name === need.split(' ')[0]); if(p) setPlanId(p.id); }}
          className="mt-2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-semibold">Unlock Now →</button>
      </div>
    </div>
  );

  if (showCheckout) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💳</div>
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <p className="text-gray-500 mt-1">SmartProfile — {plan.name} Plan</p>
        </div>
        <div className={`${plan.color} text-white rounded-2xl p-5 text-center mb-6`}>
          <div className="text-4xl font-bold">{plan.price}</div>
          <div className="text-sm opacity-80 mt-1">per year · {plan.name} Plan</div>
        </div>
        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> smartprofile.in/{form.username}</div>
          <div className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> {form.business_name}</div>
          <div className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> All {plan.name} features · 1 Year</div>
        </div>

        {/* Coupon code */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">🏷️ Have a Coupon?</p>
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div>
                <span className="text-green-700 font-bold text-sm">{appliedCoupon.code}</span>
                <span className="text-green-600 text-xs ml-2">applied — you saved ₹{appliedCoupon.discountAmount.toFixed(2)}</span>
              </div>
              <button onClick={removeCoupon} className="text-red-500 text-xs font-semibold">Remove</button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponChecking}
                  className="bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60"
                >
                  {couponChecking ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
            </div>
          )}
        </div>

        {appliedCoupon && (
          <div className="space-y-1.5 mb-5 text-sm bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-gray-600"><span>Plan price</span><span>₹{plan.amount}</span></div>
            <div className="flex justify-between text-green-600"><span>Coupon ({appliedCoupon.code})</span><span>− ₹{appliedCoupon.discountAmount.toFixed(2)}</span></div>
            <div className="border-t pt-1.5 flex justify-between font-bold text-gray-900"><span>You Pay</span><span>₹{finalAmount.toFixed(2)}</span></div>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl p-3 mb-4 text-sm text-center">{error}</div>}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-center">
          <p className="text-xs text-green-700 font-semibold">🔒 Secure payment powered by Razorpay</p>
        </div>
        <button onClick={handlePayment} disabled={loading}
          className={`w-full ${plan.color} text-white font-bold py-4 rounded-2xl text-lg hover:opacity-90 shadow-lg disabled:opacity-60`}>
          {loading ? '⏳ Processing...' : `✅ Pay ₹${finalAmount.toFixed(2)} & Create Profile`}
        </button>
        <button onClick={() => { setShowCheckout(false); setError(''); }} className="w-full mt-3 text-gray-400 text-sm">← Back to Edit</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <h1 className="text-lg font-bold text-gray-800">✨ Create SmartProfile</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:inline">💾 Progress saved automatically</span>
          <a href="/dashboard" className="text-sm text-blue-600">← Back</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4 flex flex-col md:flex-row gap-4 items-start">

        <div className="w-full md:flex-1 space-y-4">
          {error && <div className="bg-red-50 border border-red-300 text-red-600 rounded-xl p-3 text-sm">{error}</div>}

          {/* Plan */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">💎 Choose Your Plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PLANS.map(p => (
                <button key={p.id} onClick={() => { setPlanId(p.id); setAppliedCoupon(null); setCouponError(''); setCouponCode(''); }}
                  className={`rounded-xl p-3 border-2 transition-all text-center ${planId === p.id ? `${p.border} bg-blue-50` : 'border-gray-200'}`}>
                  <div className={`${p.color} text-white text-xs font-bold px-2 py-1 rounded-lg mb-2`}>{p.name}</div>
                  <div className="font-bold text-gray-800">{p.price}</div>
                  <div className="text-xs text-gray-400">/year</div>
                  {planId === p.id && <div className="text-blue-600 text-xs mt-1 font-bold">✓ Selected</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">📋 Basic Info</h2>
            <div className="space-y-3">
              <div>
                <label className={lbl}>Profile URL *</label>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <span className="px-3 py-3 text-xs text-gray-400 bg-gray-100 border-r whitespace-nowrap">smartprofile.in/</span>
                  <input value={form.username} onChange={e => update('username', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} placeholder="your-name" className="flex-1 px-3 py-3 text-sm bg-gray-50 focus:outline-none"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Full Name *</label><input value={form.full_name} onChange={e=>update('full_name',e.target.value)} placeholder="Rajesh Sharma" className={inp}/></div>
                <div><label className={lbl}>Designation</label><input value={form.designation} onChange={e=>update('designation',e.target.value)} placeholder="CEO / Realtor" className={inp}/></div>
              </div>
              <div><label className={lbl}>Business Name *</label><input value={form.business_name} onChange={e=>update('business_name',e.target.value)} placeholder="Sharma Properties" className={inp}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Tagline</label><input value={form.tagline} onChange={e=>update('tagline',e.target.value)} placeholder="Your tagline..." className={inp}/></div>
                <div><label className={lbl}>Category</label><input value={form.category} onChange={e=>update('category',e.target.value)} placeholder="Real Estate" className={inp}/></div>
              </div>
              <div><label className={lbl}>City</label><input value={form.city} onChange={e=>update('city',e.target.value)} placeholder="Mumbai, Maharashtra" className={inp}/></div>
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
                <label htmlFor="logo-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 Upload Logo</label>
                {logoPreview && <p className="text-xs text-green-600 mt-1">✓ Logo ready!</p>}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">📞 Contact</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Phone *</label><input value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="+91 98765 43210" className={inp}/></div>
              <div><label className={lbl}>WhatsApp</label><input value={form.whatsapp} onChange={e=>update('whatsapp',e.target.value)} placeholder="919876543210" className={inp}/></div>
              <div><label className={lbl}>Email</label><input value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@email.com" className={inp}/></div>
              <div><label className={lbl}>Website</label><input value={form.website} onChange={e=>update('website',e.target.value)} placeholder="https://yoursite.com" className={inp}/></div>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">🖼️ Cover Banner</h2>
            {!has('banner') ? <Lock need="Business ₹399"><div className="h-28 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">Your Banner Here</div></Lock> : (
              <>
                <div className="w-full h-28 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden mb-3 flex items-center justify-center">
                  {bannerPreview ? <img src={bannerPreview} className="w-full h-full object-cover"/> : <span className="text-gray-400 text-sm">Upload banner image</span>}
                </div>
                <input type="file" accept="image/*" onChange={e=>handleImage(e,'banner')} className="hidden" id="banner-up"/>
                <label htmlFor="banner-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700">📤 Upload Banner</label>
                {bannerPreview && <span className="ml-2 text-xs text-green-600 font-semibold">✓ Banner ready!</span>}
              </>
            )}
          </div>

          {/* About & Address */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">📍 About & Address</h2>
            {!has('about') ? <Lock need="Business ₹399"><div className="space-y-3"><div className="h-20 bg-gray-100 rounded-xl"/><div className="h-12 bg-gray-100 rounded-xl"/></div></Lock> : (
              <div className="space-y-3">
                <div><label className={lbl}>About Us</label><textarea value={form.about} onChange={e=>update('about',e.target.value)} rows={3} placeholder="About your business..." className={inp+' resize-none'}/></div>
                <div><label className={lbl}>Address</label><input value={form.address} onChange={e=>update('address',e.target.value)} placeholder="Shop No. 12, City Center..." className={inp}/></div>
                <div><label className={lbl}>Google Maps URL</label><input value={form.maps_url} onChange={e=>update('maps_url',e.target.value)} placeholder="https://maps.google.com/..." className={inp}/></div>
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

          {/* Products */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">📦 Products <span className="text-xs text-gray-400 font-normal">(max {maxProducts || 0})</span></h2>
            {!has('products') ? <Lock need="Business ₹399"><div className="space-y-2"><div className="h-16 bg-gray-100 rounded-xl"/><div className="h-16 bg-gray-100 rounded-xl"/></div></Lock> : (
              <div className="space-y-3">
                {products.slice(0, maxProducts).map((p,i)=>(
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input value={p.name} onChange={e=>{const n=[...products];n[i].name=e.target.value;setProducts(n);}} placeholder="Product name" className={inp}/>
                      <input value={p.price} onChange={e=>{const n=[...products];n[i].price=e.target.value;setProducts(n);}} placeholder="Price (₹)" className={inp}/>
                    </div>
                    <input value={p.description} onChange={e=>{const n=[...products];n[i].description=e.target.value;setProducts(n);}} placeholder="Description" className={inp}/>
                  </div>
                ))}
                {products.length < maxProducts && (
                  <button onClick={()=>setProducts([...products,{name:'',price:'',description:''}])} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-300">+ Add Product</button>
                )}
              </div>
            )}
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">⚙️ Services <span className="text-xs text-gray-400 font-normal">(max {maxServices || 0})</span></h2>
            {!has('services') ? <Lock need="Business ₹399"><div className="space-y-2"><div className="h-16 bg-gray-100 rounded-xl"/><div className="h-16 bg-gray-100 rounded-xl"/></div></Lock> : (
              <div className="space-y-3">
                {services.slice(0, maxServices).map((s,i)=>(
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input value={s.name} onChange={e=>{const n=[...services];n[i].name=e.target.value;setServices(n);}} placeholder="Service name" className={inp}/>
                      <input value={s.price} onChange={e=>{const n=[...services];n[i].price=e.target.value;setServices(n);}} placeholder="Price (₹)" className={inp}/>
                    </div>
                    <input value={s.description} onChange={e=>{const n=[...services];n[i].description=e.target.value;setServices(n);}} placeholder="Description" className={inp}/>
                  </div>
                ))}
                {services.length < maxServices && (
                  <button onClick={()=>setServices([...services,{name:'',price:'',description:''}])} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-300">+ Add Service</button>
                )}
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">🖼️ Gallery <span className="text-xs text-gray-400 font-normal">(max {maxGallery || 0} photos)</span></h2>
            {!has('gallery') ? <Lock need="Premium ₹599"><div className="grid grid-cols-3 gap-2">{[1,2,3].map(i=><div key={i} className="aspect-square bg-gray-100 rounded-xl"/>)}</div></Lock> : (
              <>
                <input type="file" accept="image/*" multiple onChange={handleGallery} className="hidden" id="gallery-up"/>
                <label htmlFor="gallery-up" className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 mb-3">📤 Upload Photos (max {maxGallery})</label>
                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {gallery.map((g,i)=><div key={i} className="aspect-square rounded-xl overflow-hidden"><img src={g.preview} className="w-full h-full object-cover"/></div>)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Testimonials */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">💬 Testimonials <span className="text-xs text-gray-400 font-normal">(max {maxTestimonials || 0})</span></h2>
            {!has('testimonials') ? <Lock need="Business ₹399"><div className="space-y-2"><div className="h-20 bg-gray-100 rounded-xl"/></div></Lock> : (
              <div className="space-y-3">
                {testimonials.slice(0, maxTestimonials).map((t,i)=>(
                  <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input value={t.name} onChange={e=>{const n=[...testimonials];n[i].name=e.target.value;setTestimonials(n);}} placeholder="Customer name" className={inp}/>
                      <select value={t.rating} onChange={e=>{const n=[...testimonials];n[i].rating=Number(e.target.value);setTestimonials(n);}} className={inp}>
                        {[5,4,3,2,1].map(r=><option key={r} value={r}>{'⭐'.repeat(r)} {r} Star</option>)}
                      </select>
                    </div>
                    <textarea value={t.text} onChange={e=>{const n=[...testimonials];n[i].text=e.target.value;setTestimonials(n);}} placeholder="What did they say?" rows={2} className={inp+' resize-none'}/>
                  </div>
                ))}
                {testimonials.length < maxTestimonials && (
                  <button onClick={()=>setTestimonials([...testimonials,{name:'',rating:5,text:''}])} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-300">+ Add Testimonial</button>
                )}
              </div>
            )}
          </div>

          {/* Business Presence */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">🏢 Business Presence <span className="text-xs text-gray-400 font-normal">(IndiaMART, JustDial etc.)</span></h2>
            {!has('biz_presence') ? <Lock need="Premium ₹599"><div className="flex gap-2 flex-wrap">{BIZ_PLATFORMS.slice(0,3).map(b=><div key={b.key} className="h-10 w-28 bg-gray-100 rounded-xl"/>)}</div></Lock> : (
              <div className="space-y-3">
                {bizPresence.slice(0, maxBiz).map((b,i)=>(
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <select value={b.platform} onChange={e=>{const n=[...bizPresence];n[i].platform=e.target.value;setBizPresence(n);}} className={inp}>
                      <option value="">Select Platform</option>
                      {BIZ_PLATFORMS.map(p=><option key={p.key} value={p.label}>{p.label}</option>)}
                    </select>
                    <input value={b.url} onChange={e=>{const n=[...bizPresence];n[i].url=e.target.value;setBizPresence(n);}} placeholder="Profile URL" className={inp}/>
                  </div>
                ))}
                {bizPresence.length < maxBiz && (
                  <button onClick={()=>setBizPresence([...bizPresence,{platform:'',url:''}])} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-300">+ Add Platform</button>
                )}
              </div>
            )}
          </div>

          {/* Brochure */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">📄 PDF Brochure</h2>
            {!has('brochure') ? <Lock need="Premium ₹599"><div className="h-12 bg-gray-100 rounded-xl"/></Lock> : (
              <input value={form.brochure_url} onChange={e=>update('brochure_url',e.target.value)} placeholder="Google Drive PDF link" className={inp}/>
            )}
          </div>

          {/* Video */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">🎥 Company Video</h2>
            {!has('video') ? <Lock need="Pro ₹999"><div className="h-12 bg-gray-100 rounded-xl"/></Lock> : (
              <input value={form.video_url} onChange={e=>update('video_url',e.target.value)} placeholder="YouTube video URL" className={inp}/>
            )}
          </div>

          {/* Theme */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">🎨 Card Theme</h2>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(t=>(
                <button key={t.id} onClick={()=>setTheme(t)}
                  className={`h-14 rounded-xl bg-gradient-to-r ${t.bg} border-4 transition-all relative ${theme.id===t.id?'border-blue-500 scale-105':'border-transparent'}`}>
                  <span className="text-white text-sm font-bold drop-shadow">{t.name}</span>
                  {theme.id===t.id && <span className="absolute top-1 right-2 text-white">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <button onClick={()=>{if(!form.username||!form.business_name||!form.phone){setError('Username, Business Name aur Phone required!');return;}setError('');setShowCheckout(true);}}
            className={`w-full ${plan.color} text-white font-bold py-4 rounded-2xl text-lg hover:opacity-90 shadow-lg mb-8`}>
            🚀 Get Started — {plan.price}/year
          </button>
        </div>

        {/* Live Preview */}
        <div className="hidden md:block w-72 flex-shrink-0 sticky top-20">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">📱 Live Preview</p>
          <div className="bg-gray-900 rounded-[2.5rem] p-2.5 shadow-2xl">
            <div className="rounded-[2rem] overflow-hidden bg-white" style={{height:'600px',overflowY:'auto'}}>
              <div className="relative" style={{height:'110px',flexShrink:0}}>
                {bannerPreview && has('banner') ? <img src={bannerPreview} className="w-full h-full object-cover"/> : <div className={`w-full h-full bg-gradient-to-r ${theme.bg}`}/>}
                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden flex items-center justify-center" style={{width:68,height:68}}>
                    {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover"/> : <span className="text-2xl font-bold text-gray-600">{form.business_name?form.business_name[0].toUpperCase():'?'}</span>}
                  </div>
                </div>
              </div>
              <div className="pt-10 pb-2 px-3 text-center">
                <h2 className="font-bold text-gray-900 text-sm">{form.business_name||'Business Name'}</h2>
                {(form.full_name||form.designation) && <p className="text-xs mt-0.5 font-semibold" style={{color:theme.accent}}>{form.full_name}{form.designation?` · ${form.designation}`:''}</p>}
                {form.city && <p className="text-xs text-gray-400 mt-0.5">📍 {form.city}</p>}
                {form.tagline && <p className="text-xs text-gray-400 mt-0.5 italic">"{form.tagline}"</p>}
              </div>
              <div className="px-3 pb-2">
                <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                  {form.phone && <div className="bg-green-500 rounded-xl py-2 text-center text-white"><div className="text-sm">📞</div><div className="text-xs font-semibold">Call</div></div>}
                  {form.whatsapp && <div className="bg-green-400 rounded-xl py-2 text-center text-white"><div className="text-sm">💬</div><div className="text-xs">WhatsApp</div></div>}
                  <div className="bg-blue-600 rounded-xl py-2 text-center text-white"><div className="text-sm">👤</div><div className="text-xs">Save</div></div>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {form.email && <div className="border border-gray-200 rounded-xl py-2 text-center"><div className="text-xs">✉️</div><div className="text-xs text-gray-500">Email</div></div>}
                  {form.website && <div className="border border-gray-200 rounded-xl py-2 text-center"><div className="text-xs">🌐</div><div className="text-xs text-gray-500">Website</div></div>}
                  {form.maps_url && <div className="border border-gray-200 rounded-xl py-2 text-center"><div className="text-xs">📍</div><div className="text-xs text-gray-500">Maps</div></div>}
                </div>
              </div>
              {form.about && has('about') && <div className="mx-3 mb-2 bg-blue-50 rounded-xl p-2.5"><p className="text-xs font-bold text-blue-700 mb-1">About Us</p><p className="text-xs text-gray-600 line-clamp-2">{form.about}</p></div>}
              {has('social') && SOCIALS.some(s=>form[s.key]) && (
                <div className="mx-3 mb-2">
                  <p className="text-xs font-bold text-gray-400 mb-1.5 text-center">Connect With Us</p>
                  <div className="flex justify-center gap-2">
                    {SOCIALS.map(s=>form[s.key]?<div key={s.key} className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor:s.color}}><SocialIcon platformKey={s.key} /></div>:null)}
                  </div>
                </div>
              )}
              {has('products') && products.some(p=>p.name) && (
                <div className="mx-3 mb-2">
                  <p className="text-xs font-bold text-gray-700 mb-1.5">📦 Products</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {products.filter(p=>p.name).slice(0,2).map((p,i)=><div key={i} className="border border-gray-100 rounded-lg p-2"><p className="text-xs font-semibold">{p.name}</p>{p.price&&<p className="text-xs text-blue-600">₹{p.price}</p>}</div>)}
                  </div>
                </div>
              )}
              {has('testimonials') && testimonials.some(t=>t.name) && (
                <div className="mx-3 mb-2">
                  <p className="text-xs font-bold text-gray-700 mb-1.5">💬 Testimonials</p>
                  {testimonials.filter(t=>t.name).slice(0,1).map((t,i)=><div key={i} className="bg-gray-50 rounded-lg p-2"><p className="text-xs italic text-gray-600">"{t.text}"</p><p className="text-xs font-bold mt-1">— {t.name}</p></div>)}
                </div>
              )}
              <div className="mx-3 mb-3"><div className="bg-gray-900 rounded-xl py-2.5 text-center text-white text-xs font-bold">💾 Save Contact</div></div>
              <div className="text-center pb-3"><p className="text-xs text-gray-400">Powered by <span className="font-bold text-blue-500">SmartProfile.in</span></p></div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className={`inline-block ${plan.color} text-white text-sm font-bold px-4 py-1.5 rounded-full shadow`}>{plan.name} {plan.price}/yr</span>
          </div>
        </div>

      </div>
    </div>
  );
}