"use client";
import { useEffect, useState, use } from "react";
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

function SocialIcon({ platform }) {
  const p = (platform || "").toLowerCase();
  const common = "w-5 h-5";
  if (p === "facebook") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/></svg>;
  if (p === "instagram") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.163 6.163 0 100 12.326 6.163 6.163 0 000-12.326zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (p === "youtube") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (p === "linkedin") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 110-4.124 2.062 2.062 0 010 4.124zM7.114 20.452H3.558V9h3.556v11.452z"/></svg>;
  if (p === "twitter") return <svg className={common} viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
  return <span className="text-white text-xs font-bold">{(platform || "?")[0]?.toUpperCase()}</span>;
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
  const saveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.full_name || profile.business_name}\nORG:${profile.business_name}\nTEL:${profile.phone}\nEMAIL:${profile.email || ""}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${profile.business_name}.vcf`; a.click();
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#0a1628] h-36 relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {profile.logo_url ? <img src={profile.logo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#0a1628] flex items-center justify-center text-white text-3xl font-bold">{(profile.business_name || "?")[0]}</div>}
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
            <button className="mt-2 bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1">
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
function BusinessProfile({ profile, products, socials, testimonials, gallery }) {
  const { displayName, line2, line3 } = getCardIdentity(profile);
  const saveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.full_name || profile.business_name}\nORG:${profile.business_name}\nTEL:${profile.phone}\nEMAIL:${profile.email || ""}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${profile.business_name}.vcf`; a.click();
  };
  const socialColors = { facebook:"#1877F2", instagram:"#E4405F", youtube:"#FF0000", linkedin:"#0A66C2", twitter:"#1DA1F2" };

  const testimonialLimits = { business: 2, premium: 5, pro: 10, ultimate: 10 };
  const limit = testimonialLimits[profile.plan] || 2;
  const visibleTestimonials = (testimonials || []).slice(0, limit);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-40 relative">
          {profile.banner_url ? <img src={profile.banner_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800" />}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {profile.logo_url ? <img src={profile.logo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold">{(profile.business_name || "?")[0]}</div>}
            </div>
          </div>
        </div>
        <div className="pt-16 pb-4 px-5 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
          {line2 && <p className="text-gray-700 font-semibold text-sm mt-1">{line2}</p>}
          {line3 && <p className="text-blue-600 font-medium text-xs mt-0.5">{line3}</p>}
          {profile.city && <p className="text-gray-500 text-sm mt-1">📍 {profile.city}{profile.state ? `, ${profile.state}` : ""}</p>}
        </div>
        <div className="grid grid-cols-4 gap-2 px-4 mb-4">
          <a href={`tel:${profile.phone}`} className="flex flex-col items-center justify-center bg-green-500 text-white py-3 rounded-2xl text-xs font-semibold gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Call
          </a>
          <a href={`https://wa.me/${profile.whatsapp || profile.phone}`} className="flex flex-col items-center justify-center bg-green-400 text-white py-3 rounded-2xl text-xs font-semibold gap-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <button onClick={saveContact} className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 py-3 rounded-2xl text-xs font-semibold gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Save Contact
          </button>
          <a href={profile.maps_url || "#"} className="flex flex-col items-center justify-center bg-blue-100 text-blue-700 py-3 rounded-2xl text-xs font-semibold gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Location
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
              {socials.slice(0, 2).map((s) => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shadow" style={{backgroundColor: socialColors[s.platform?.toLowerCase()] || "#666"}}><SocialIcon platform={s.platform} /></div>
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
              <span className="text-xs text-blue-600 font-medium">View All &gt;</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 2).map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden border border-gray-200">
                  {p.image_url ? <div className="w-full h-24 bg-gray-50 flex items-center justify-center"><img src={p.image_url} className="w-full h-full object-contain" /></div> : <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>}
                  <div className="p-2"><p className="text-xs font-bold text-gray-800">{p.name}</p><p className="text-xs text-gray-500">{p.description}</p></div>
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
              {gallery.map((g) => (
                <img key={g.id} src={g.image_url} alt={g.caption || ""} className="w-full h-20 object-cover rounded-xl border border-gray-200" />
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
            <button className="mt-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1">
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

export default function ProfilePage({ params }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [socials, setSocials] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
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
    return <BusinessProfile profile={profile} products={products} socials={socials} testimonials={testimonials} gallery={gallery} />;
  }
  return <BasicProfile profile={profile} />;
}