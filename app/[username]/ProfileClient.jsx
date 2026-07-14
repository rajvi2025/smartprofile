"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// Converts a city name like "New Delhi" into a URL-safe slug like "new-delhi"
function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

// Digital Card lets the owner choose whether their personal name or their
// business name is the big prominent heading (profile.display_as, set in
// Edit Profile). Defaults to 'business' if not set. Below the big name,
// the other two details (company name and designation) stack as separate
// lines. The Directory listing is intentionally unaffected by this — it
// always shows the business name.
function getCardIdentity(profile) {
  const isPersonal = profile.display_as === 'personal';
  const displayName = isPersonal
    ? (profile.full_name || profile.business_name)
    : (profile.business_name || profile.full_name);
  const line2 = isPersonal ? profile.business_name : profile.full_name;
  const line3 = profile.designation;
  return { displayName, line2, line3 };
}

function QRSection({ username }) {
  const [qrUrl, setQrUrl] = useState("");
  useEffect(() => {
    const url = `https://smartprofile.in/${username}`;
    QRCode.toDataURL(url, { width: 120, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } })
      .then(setQrUrl);
  }, [username]);
  return qrUrl ? (
    <img src={qrUrl} alt="QR Code" className="w-20 h-20 rounded-xl border border-gray-200" />
  ) : (
    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400">Loading...</div>
  );
}

const SOCIAL_DOMAINS = {
  facebook: 'facebook.com',
  instagram: 'instagram.com',
  youtube: 'youtube.com',
  linkedin: 'linkedin.com',
  'twitter/x': 'x.com',
  twitter: 'x.com',
  threads: 'threads.net',
  pinterest: 'pinterest.com',
  telegram: 'telegram.org',
};
function SocialIcon({ platform }) {
  const domain = SOCIAL_DOMAINS[(platform || '').toLowerCase()];
  if (!domain) return <span className="text-gray-400 text-xs font-bold">{(platform || "?")[0]?.toUpperCase()}</span>;
  return <img src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`} alt="" className="w-6 h-6 rounded-sm" />;
}

const BIZ_DOMAINS = {
  'google business profile': 'business.google.com',
  'justdial': 'justdial.com',
  'indiamart': 'indiamart.com',
  'tradeindia': 'tradeindia.com',
  'exportersindia': 'exportersindia.com',
  'sulekha': 'sulekha.com',
  'amazon': 'amazon.in',
  'flipkart': 'flipkart.com',
  'meesho': 'meesho.com',
  'jiomart': 'jiomart.com',
  'blinkit': 'blinkit.com',
  'zepto': 'zeptonow.com',
  'swiggy instamart': 'swiggy.com',
  'zomato': 'zomato.com',
  'swiggy': 'swiggy.com',
  'magicpin': 'magicpin.in',
  'magicbricks': 'magicbricks.com',
  '99acres': '99acres.com',
  'housing.com': 'housing.com',
  'nobroker': 'nobroker.in',
  'practo': 'practo.com',
  'apollo 24/7': 'apollo247.com',
  'naukri': 'naukri.com',
  'apna': 'apna.co',
  'indeed': 'indeed.com',
  'alibaba': 'alibaba.com',
  'global sources': 'globalsources.com',
  'tradewheel': 'tradewheel.com',
};
function BizIcon({ platform }) {
  const domain = BIZ_DOMAINS[(platform || '').toLowerCase()];
  if (!domain) return <span className="text-gray-400 text-xs font-bold">{(platform || "?")[0]?.toUpperCase()}</span>;
  return <img src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`} alt="" className="w-6 h-6 rounded-sm" />;
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= (rating || 5) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.286 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.196-1.538-1.118l1.285-3.957a1 1 0 00-.363-1.118L2.98 9.385c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.958z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialsSection({ testimonials, username }) {
  return (
    <div className="mb-4 px-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-bold text-gray-800">
          What Our Clients Say {testimonials && testimonials.length > 0 ? `(${testimonials.length})` : ""}
        </p>
        <a href={`/${username}/review`} className="text-xs text-blue-600 font-semibold whitespace-nowrap">
          Write a Review →
        </a>
      </div>
      {testimonials && testimonials.length > 0 ? (
        <>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {testimonials.map((t) => (
              <div key={t.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex-shrink-0 w-[85%] snap-center">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">{t.name}</span>
                  <StarRating rating={t.rating} />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{t.review}</p>
              </div>
            ))}
          </div>
          {testimonials.length > 1 && (
            <p className="text-center text-xs text-gray-400 mt-1">← Swipe to see more →</p>
          )}
        </>
      ) : (
        <p className="text-xs text-gray-400">No reviews yet. Be the first to share your experience!</p>
      )}
    </div>
  );
}

// ---------- BASIC PLAN: simple digital visiting card ----------
function BasicProfile({ profile }) {
  const { displayName, line2, line3 } = getCardIdentity(profile);
  const shareProfile = async () => {
    const url = `https://smartprofile.in/${profile.username}`;
    const shareData = { title: profile.business_name || profile.full_name, text: `Check out ${profile.business_name || profile.full_name} on SmartProfile`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled — no problem */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Profile link copied to clipboard!");
      } catch (e) {
        window.prompt("Copy this link:", url);
      }
    }
  };
  const saveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.full_name || profile.business_name}\nORG:${profile.business_name}\nTEL:${profile.phone}\nEMAIL:${profile.email || ""}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${profile.business_name}.vcf`; a.click();
  };
  return (
    <div className="min-h-screen bg-[#faf6ef] flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.16),0_50px_100px_-20px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="bg-[#0a1628] h-36 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {profile.logo_url ? <Image src={profile.logo_url} alt={profile.business_name || "Business logo"} fill sizes="96px" className="object-cover" /> : <div className="w-full h-full bg-[#0a1628] flex items-center justify-center text-white text-3xl font-bold">{(profile.business_name || "?")[0]}</div>}
            </div>
          </div>
        </div>
        <div className="pt-16 pb-4 px-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          {line2 && <p className="text-gray-700 font-semibold text-sm mt-1">{line2}</p>}
          {line3 && <p className="text-orange-500 font-medium text-xs mt-0.5">{line3}</p>}
          {profile.city && <p className="text-gray-500 text-sm mt-1">📍 {profile.city}{profile.state ? `, ${profile.state}` : ""}</p>}
        </div>
        <div className="mx-4 mb-4 rounded-2xl border border-gray-200 grid grid-cols-3">
          {[["12+","Years"],["200+","Deals"],["500+","Happy Clients"]].map(([n,l],i) => (
            <div key={l} className={`py-3 text-center ${i < 2 ? "border-r border-gray-200" : ""}`}>
              <div className="text-lg font-bold text-gray-800">{n}</div>
              <div className="text-xs text-gray-400">{l}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 px-4 mb-4">
          <a href={`tel:${profile.phone}`} className="flex flex-col items-center justify-center bg-green-500 text-white py-3 rounded-2xl shadow font-semibold text-sm gap-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Call
          </a>
          <a href={`https://wa.me/${profile.whatsapp || profile.phone}`} className="flex flex-col items-center justify-center bg-green-400 text-white py-3 rounded-2xl shadow font-semibold text-sm gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <button onClick={saveContact} className="flex flex-col items-center justify-center bg-blue-600 text-white py-3 rounded-2xl shadow font-semibold text-sm gap-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Save Contact
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 px-4 mb-4">
          {profile.email && <a href={`mailto:${profile.email}`} className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 py-3 rounded-2xl text-gray-600 text-sm gap-1">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Email
          </a>}
          {profile.website && <a href={profile.website} className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 py-3 rounded-2xl text-gray-600 text-sm gap-1">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            Website
          </a>}
          {profile.address && <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 py-3 rounded-2xl text-gray-600 text-sm gap-1">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Location
          </div>}
        </div>
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
          <QRSection username={profile.username} />
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-sm">Share My Profile</p>
            <p className="text-gray-500 text-xs mt-1">Scan QR code to save my details instantly.</p>
            <button onClick={shareProfile} className="mt-2 bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share Profile
            </button>
          </div>
        </div>
        <div className="text-center py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Powered by</p>
          <p className="font-bold text-gray-700 text-sm">Smart<span className="text-orange-500">Profile</span>.in</p>
          <p className="text-xs text-gray-400">One Profile. Complete Business.</p>
        </div>
      </div>
    </div>
  );
}

// ---------- BUSINESS+ PLANS: richer card-style with more sections ----------
function BusinessProfile({ profile, products, socials, testimonials, gallery, bizPresence }) {
  const { displayName, line2, line3 } = getCardIdentity(profile);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const touchStartY = useRef(0);
  const shareProfile = async () => {
    const url = `https://smartprofile.in/${profile.username}`;
    const shareData = { title: profile.business_name || profile.full_name, text: `Check out ${profile.business_name || profile.full_name} on SmartProfile`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (e) { /* user cancelled — no problem */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Profile link copied to clipboard!");
      } catch (e) {
        window.prompt("Copy this link:", url);
      }
    }
  };
  const saveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.full_name || profile.business_name}\nORG:${profile.business_name}\nTEL:${profile.phone}\nEMAIL:${profile.email || ""}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${profile.business_name}.vcf`; a.click();
  };


  const testimonialLimits = { business: 2, premium: 5, pro: 10, ultimate: 10 };
  const limit = testimonialLimits[profile.plan] || 2;
  const visibleTestimonials = (testimonials || []).slice(0, limit);

  return (
    <div className="min-h-screen bg-[#faf6ef] flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.16),0_50px_100px_-20px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="h-40 relative">
          {profile.banner_url ? <Image src={profile.banner_url} alt={`${profile.business_name || "Business"} banner`} fill sizes="384px" priority className="object-cover" /> : <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800" />}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {profile.logo_url ? <Image src={profile.logo_url} alt={profile.business_name || "Business logo"} fill sizes="96px" className="object-cover" /> : <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold">{(profile.business_name || "?")[0]}</div>}
            </div>
          </div>
        </div>
        <div className="pt-16 pb-4 px-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          {line2 && <p className="text-gray-700 font-semibold text-sm mt-1">{line2}</p>}
          {line3 && <p className="text-blue-600 font-medium text-xs mt-0.5">{line3}</p>}
          {profile.city && <p className="text-gray-500 text-sm mt-1">📍 {profile.city}{profile.state ? `, ${profile.state}` : ""}</p>}
        </div>
        <div className="grid grid-cols-4 gap-2 px-6 mb-4">
          <a href={`tel:${profile.phone}`} className="flex flex-col items-center gap-1.5">
            <span className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </span>
            <span className="text-[11px] font-semibold text-gray-600">Call</span>
          </a>
          <a href={`https://wa.me/${profile.whatsapp || profile.phone}`} className="flex flex-col items-center gap-1.5">
            <span className="w-12 h-12 rounded-full bg-green-400 text-white flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </span>
            <span className="text-[11px] font-semibold text-gray-600">WhatsApp</span>
          </a>
          <button onClick={saveContact} className="flex flex-col items-center gap-1.5">
            <span className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </span>
            <span className="text-[11px] font-semibold text-gray-600">Save</span>
          </button>
          <a href={profile.maps_url || "#"} className="flex flex-col items-center gap-1.5">
            <span className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </span>
            <span className="text-[11px] font-semibold text-gray-600">Location</span>
          </a>
        </div>
        {profile.about && (
          <div className="mx-4 mb-4 p-4 bg-blue-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span className="font-bold text-blue-700 text-sm">About Us</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{profile.about}</p>
          </div>
        )}
        <div className="mx-4 mb-4 space-y-1">
          {profile.phone && <a href={`tel:${profile.phone}`} className="flex items-center gap-3 py-3 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span className="text-sm text-gray-700 flex-1">+91 {profile.phone}</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </a>}
          {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-3 py-3 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span className="text-sm text-gray-700 flex-1">{profile.email}</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </a>}
          {profile.website && <a href={profile.website} className="flex items-center gap-3 py-3 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            <span className="text-sm text-gray-700 flex-1">{profile.website}</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </a>}
          {profile.address && <div className="flex items-start gap-3 py-3 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="text-sm text-gray-700 flex-1">{profile.address}</span>
          </div>}
          {profile.maps_url && <a href={profile.maps_url} className="flex items-center gap-3 py-3 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4285F4"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>
            <span className="text-sm text-blue-600 font-medium flex-1">View on Google Maps</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </a>}
        </div>
        {socials.length > 0 && (
          <div className="mx-4 mb-4">
            <p className="text-sm font-bold text-gray-700 mb-3 text-center">Connect With Us</p>
            <div className="flex justify-center gap-4">
              {socials.map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow bg-gray-100 border border-gray-200"><SocialIcon platform={s.platform} /></div>
                  <span className="text-xs text-gray-500">{s.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        {products.length > 0 && (
          <div className="mx-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-800">Our Products / Services ({products.length})</p>
              <button onClick={() => setProductsOpen(true)} className="text-xs text-blue-600 font-medium">View All &gt;</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 2).map((p) => (
                <div key={p.id} onClick={() => setProductsOpen(true)} className="rounded-2xl overflow-hidden border border-gray-200 cursor-pointer active:opacity-80">
                  {p.image_url ? <div className="relative w-full h-24 bg-gray-50 flex items-center justify-center"><Image src={p.image_url} alt={p.name || "Product"} fill sizes="150px" className="object-contain" /></div> : <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>}
                  <div className="p-2"><p className="text-xs font-bold text-gray-800">{p.name}</p><p className="text-xs text-gray-500 line-clamp-2">{p.description}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {productsOpen && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
              <p className="font-bold text-gray-800">Products / Services ({products.length})</p>
              <button onClick={() => setProductsOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-bold" aria-label="Close">
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {products.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden border border-gray-200">
                  {p.image_url ? <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center"><Image src={p.image_url} alt={p.name || "Product"} fill sizes="384px" className="object-contain" /></div> : <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>}
                  <div className="p-3"><p className="text-sm font-bold text-gray-800">{p.name}</p><p className="text-xs text-gray-500 mt-1">{p.description}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {gallery && gallery.length > 0 && (
          <div className="mx-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-800">Gallery ({gallery.length})</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {gallery.map((g, idx) => (
                <div key={g.id} className="relative w-full h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer active:opacity-80" onClick={() => setLightboxIndex(idx)}>
                  <Image
                    src={g.image_url}
                    alt={g.caption || ""}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {lightboxIndex !== null && gallery && gallery.length > 0 && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center touch-pan-y"
            onClick={() => setLightboxIndex(null)}
            onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
            onTouchEnd={(e) => {
              const diff = touchStartY.current - e.changedTouches[0].clientY;
              if (Math.abs(diff) > 40) {
                if (diff > 0) setLightboxIndex((lightboxIndex + 1) % gallery.length); // swiped up -> next
                else setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); // swiped down -> prev
              }
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl font-bold z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <p className="absolute top-5 left-5 text-white/70 text-xs font-semibold">
              {lightboxIndex + 1} / {gallery.length}
            </p>
            {gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }}
                className="absolute top-16 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl"
                aria-label="Previous"
              >
                ⌃
              </button>
            )}
            <img
              key={lightboxIndex}
              src={gallery[lightboxIndex].image_url}
              alt={gallery[lightboxIndex].caption || ""}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90%] max-h-[75%] object-contain rounded-lg gallery-flip"
            />
            {gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }}
                className="absolute bottom-10 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-2xl"
                aria-label="Next"
              >
                ⌄
              </button>
            )}
            <style jsx>{`
              @keyframes galleryFlip {
                0% { transform: rotateX(90deg); opacity: 0; }
                100% { transform: rotateX(0deg); opacity: 1; }
              }
              .gallery-flip {
                animation: galleryFlip 0.35s ease-out;
                transform-style: preserve-3d;
              }
            `}</style>
          </div>
        )}
        {(profile.plan === "premium" || profile.plan === "pro") && bizPresence && bizPresence.length > 0 && (
          <div className="mx-4 mb-4">
            <p className="text-sm font-bold text-gray-800 mb-3">Business Presence</p>
            <div className="flex gap-3 flex-wrap">
              {bizPresence.map((b) => (
                <a key={b.id} href={b.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shadow bg-gray-100 border border-gray-200">
                    <BizIcon platform={b.platform} />
                  </div>
                  <span className="text-xs text-gray-500">{b.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <TestimonialsSection testimonials={visibleTestimonials} username={profile.username} />
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4">
          <QRSection username={profile.username} />
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-sm">Share My Profile</p>
            <p className="text-gray-500 text-xs mt-1">Scan QR code to save my details instantly.</p>
            <button onClick={shareProfile} className="mt-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share Profile
            </button>
          </div>
        </div>
        <div className="text-center py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Powered by</p>
          <p className="font-bold text-gray-700 text-sm">Smart<span className="text-blue-600">Profile</span>.in</p>
          <a href="/" className="text-xs text-blue-600">Create Your Own Smart Profile →</a>
        </div>
      </div>
    </div>
  );
}

// ---------- Shown when profile exists but has no active Digital Card (e.g. free directory-only listing) ----------
function NoDigitalCard({ profile }) {
  const citySlug = slugifyCity(profile.city);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-5xl mb-4">📇</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Digital Card Not Available</h1>
        <p className="text-gray-500 text-sm mb-6">{profile.business_name || profile.full_name} hasn't activated a Digital Business Card yet.</p>
        <div className="flex flex-col gap-3">
          {profile.directory_active && (
            <a href={`/directory/${citySlug}/${profile.username}`} className="inline-block bg-gray-100 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm">
              View Directory Listing →
            </a>
          )}
          <a href="/pricing" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm">
            🚀 Upgrade — Create Your Digital Card
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProfileClient({ username }) {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [socials, setSocials] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [bizPresence, setBizPresence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: p } = await supabase.from("profiles").select("*").eq("username", username).single();
      if (!p) { setLoading(false); return; }
      setProfile(p);

      // Only fetch the extra sections if the Digital Card is actually active for this profile
      if (p.digital_card_active) {
        const { data: pr } = await supabase.from("products").select("*").eq("profile_id", p.id);
        setProducts(pr || []);
        const { data: sl } = await supabase.from("social_links").select("*").eq("profile_id", p.id);
        setSocials(sl || []);
        const { data: tm } = await supabase.from("testimonials").select("*").eq("profile_id", p.id).order("sort_order", { ascending: true });
        setTestimonials(tm || []);
        try {
          const { data: gl } = await supabase.from("gallery").select("*").eq("profile_id", p.id).order("sort_order", { ascending: true });
          setGallery(gl || []);
        } catch (e) {
          setGallery([]);
        }
        try {
          const { data: bp } = await supabase.from("business_presence").select("*").eq("profile_id", p.id);
          setBizPresence(bp || []);
        } catch (e) {
          setBizPresence([]);
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-blue-600 text-xl font-semibold animate-pulse">Loading Profile...</div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-700">Profile Not Found</h1>
        <p className="text-gray-500 mt-2">smartprofile.in/{username} does not exist</p>
      </div>
    </div>
  );

  // Digital Card is a separate paid product — only show it if this flag is active.
  if (!profile.digital_card_active) {
    return <NoDigitalCard profile={profile} />;
  }

  if (profile.plan === "business" || profile.plan === "premium" || profile.plan === "pro" || profile.plan === "ultimate") {
    return <BusinessProfile profile={profile} products={products} socials={socials} testimonials={testimonials} gallery={gallery} bizPresence={bizPresence} />;
  }
  return <BasicProfile profile={profile} />;
}