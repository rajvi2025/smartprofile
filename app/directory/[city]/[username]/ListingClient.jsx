"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

function QRSection({ username }) {
  const [qrUrl, setQrUrl] = useState("");
  useEffect(() => {
    // QR always points to the Digital Card URL, not the Directory URL
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
  return <img src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`} alt="" className="w-5 h-5 rounded-sm" />;
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

// ---------- REVIEWS TAB: full list + write review CTA ----------
function ReviewsTab({ testimonials, username }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-base">Customer Reviews</h3>
        <a href={`/${username}/review`} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap">
          Write a Review
        </a>
      </div>
      {testimonials && testimonials.length > 0 ? (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800 text-sm">{t.name}</span>
                <StarRating rating={t.rating} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-400">No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}

// ---------- DIRECTORY LISTING: full JustDial-style listing page ----------
function BusinessProfile({ profile, products, socials, testimonials, gallery, related }) {
  const [activeTab, setActiveTab] = useState("overview");

  const saveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.full_name || profile.business_name}\nORG:${profile.business_name}\nTEL:${profile.phone}\nEMAIL:${profile.email || ""}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${profile.business_name}.vcf`; a.click();
  };



  const testimonialLimits = { business: 2, premium: 5, pro: 10, ultimate: 10 };
  const limit = testimonialLimits[profile.plan] || 2;
  const visibleTestimonials = (testimonials || []).slice(0, limit);

  const reviewCount = testimonials ? testimonials.length : 0;
  const avgRating = reviewCount > 0
    ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / reviewCount
    : 0;

  const galleryImages = (gallery && gallery.length > 0)
    ? gallery
    : products.filter(p => p.image_url).map(p => ({ id: `p-${p.id}`, image_url: p.image_url, caption: p.name }));

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products & Services" },
    { id: "gallery", label: "Gallery" },
    { id: "reviews", label: `Reviews (${reviewCount})` },
  ];

  // Directory listings always lead with the Business Name — the person's
  // name/designation shown smaller underneath. Unlike the Digital Card,
  // there's no personal/business toggle here on purpose.
  const displayName = profile.business_name || profile.full_name;
  const subtitleParts = [profile.full_name, profile.designation].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="h-44 md:h-64 relative">
        {profile.banner_url ? (
          <Image
            src={profile.banner_url}
            alt={`${profile.business_name || profile.full_name || "Business"} banner`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800" />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header card, overlapping the banner */}
        <div className="bg-white rounded-2xl shadow-md p-5 md:p-6 -mt-14 md:-mt-16 relative z-10 flex flex-col md:flex-row gap-5 md:items-end">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white flex-shrink-0 -mt-8 md:mt-0">
            {profile.logo_url ? (
              <Image
                src={profile.logo_url}
                alt={`${profile.business_name || "Business"} logo`}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                {(profile.business_name || "?")[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{displayName}</h1>
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 2.4 3.4-.4.4 3.4L21 10l-2.8 2.6.4 3.4-3.4-.4L12 18l-2.4-2.4-3.4.4-.4-3.4L3 10l2.8-2.6-.4-3.4 3.4.4L12 2z"/><path d="M9.5 12l1.8 1.8 3.2-3.6" stroke="white" strokeWidth="1.5" fill="none"/></svg>
            </div>
            {subtitleParts.length > 0 && (
              <p className="text-gray-500 font-medium text-sm mt-1">{subtitleParts.join(" · ")}</p>
            )}
            {(profile.city || profile.address) && (
              <p className="text-gray-500 text-sm mt-1">📍 {profile.address || `${profile.city}${profile.state ? `, ${profile.state}` : ""}`}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {reviewCount > 0 ? (
                <>
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">{avgRating.toFixed(1)} ★</span>
                  <span className="text-xs text-gray-500">{reviewCount} Ratings</span>
                </>
              ) : (
                <span className="text-xs text-gray-400 italic">No reviews yet</span>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <a href={`tel:${profile.phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Call
            </a>
            <a href={`https://wa.me/${profile.whatsapp || profile.phone}`} className="flex items-center justify-center gap-2 bg-white border-2 border-green-500 text-green-600 px-4 py-2.5 rounded-xl font-semibold text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <button onClick={saveContact} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Save Contact
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mt-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content grid: tab content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          <div className="lg:col-span-2">

            {activeTab === "overview" && (
              <div className="space-y-4">
                {profile.about && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-800 text-base mb-2">About Us</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{profile.about}</p>
                  </div>
                )}
                <div className="bg-white rounded-2xl border border-gray-200 grid grid-cols-3 divide-x divide-gray-200">
                  {[["12+", "Years"], ["200+", "Deals"], ["500+", "Happy Clients"]].map(([n, l]) => (
                    <div key={l} className="py-4 text-center">
                      <div className="text-lg font-bold text-gray-800">{n}</div>
                      <div className="text-xs text-gray-400">{l}</div>
                    </div>
                  ))}
                </div>
                {socials.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-800 text-base mb-3">Connect With Us</h3>
                    <div className="flex gap-4">
                      {socials.map((s) => (
                        <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center shadow bg-gray-100 border border-gray-200">
                            <SocialIcon platform={s.platform} />
                          </div>
                          <span className="text-xs text-gray-500">{s.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "products" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 text-base mb-4">Products & Services ({products.length})</h3>
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {products.map((p) => (
                      <div key={p.id} className="rounded-xl overflow-hidden border border-gray-200">
                        {p.image_url ? (
                          <div className="relative w-full h-28">
                            <Image
                              src={p.image_url}
                              alt={p.name || "Product"}
                              fill
                              sizes="(max-width: 768px) 33vw, 200px"
                              className="object-cover"
                            />
                          </div>
                        ) : <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>}
                        <div className="p-2">
                          <p className="text-xs font-bold text-gray-800">{p.name}</p>
                          {p.description && <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>}
                          {p.price && <p className="text-xs text-blue-600 font-semibold mt-1">₹{p.price}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No products or services added yet.</p>
                )}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 text-base mb-4">Photos ({galleryImages.length})</h3>
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryImages.map((g) => (
                      <div key={g.id} className="relative w-full h-28 rounded-xl overflow-hidden border border-gray-200">
                        <Image
                          src={g.image_url}
                          alt={g.caption || ""}
                          fill
                          sizes="(max-width: 768px) 33vw, 200px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No photos uploaded yet.</p>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewsTab testimonials={visibleTestimonials} username={profile.username} />
            )}

          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-800 text-base mb-3">Contact</h3>
              <div className="space-y-2">
                {profile.phone && <a href={`tel:${profile.phone}`} className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span className="text-sm text-gray-700">+91 {profile.phone}</span>
                </a>}
                {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span className="text-sm text-gray-700">{profile.email}</span>
                </a>}
                {profile.website && <a href={profile.website} className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                  <span className="text-sm text-gray-700 truncate">{profile.website}</span>
                </a>}
              </div>

              {profile.address && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-gray-800 text-sm mb-2">Address</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.address}</p>
                  {profile.maps_url && (
                    <a href={profile.maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold mt-2">
                      Get Directions →
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <QRSection username={profile.username} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">Share My Profile</p>
                <p className="text-gray-500 text-xs mt-1">Scan QR code to save details instantly.</p>
              </div>
            </div>

            <div className="rounded-2xl p-5 text-center text-white" style={{ background: "linear-gradient(160deg, #1e40af, #3b82f6)" }}>
              <div className="text-3xl mb-2">📢</div>
              <p className="font-bold text-sm mb-1">Advertise Here</p>
              <p className="text-xs text-blue-100 mb-3 leading-relaxed">Get your business seen by thousands of customers searching every day.</p>
              <a href="/contact" className="inline-block bg-white text-blue-700 text-xs font-bold px-4 py-2 rounded-lg">Contact Us →</a>
            </div>

            <div className="text-center py-3">
              <p className="text-xs text-gray-400">Powered by</p>
              <p className="font-bold text-gray-700 text-sm">Smart<span className="text-blue-600">Profile</span>.in</p>
              <a href="/" className="text-xs text-blue-600">Create Your Own Smart Profile →</a>
            </div>
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="pb-10">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Related Businesses</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((r) => (
                <a key={r.username} href={`/directory/${slugifyCity(r.city)}/${r.username}`} className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="relative w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg mb-3 overflow-hidden">
                    {r.logo_url ? (
                      <Image
                        src={r.logo_url}
                        alt={r.business_name || r.full_name || "Business"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (r.business_name || r.full_name || "?")[0]}
                  </div>
                  <p className="text-sm font-bold text-gray-800 truncate">{r.business_name || r.full_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.category}</p>
                  {r.city && <p className="text-xs text-gray-400 mt-0.5">📍 {r.city}</p>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ListingClient({ username, cityParam }) {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [socials, setSocials] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: p } = await supabase.from("profiles").select("*").eq("username", username).single();
      if (!p) { setLoading(false); return; }

      // If the city in the URL doesn't match the profile's actual city, redirect to the correct URL
      const correctCitySlug = slugifyCity(p.city);
      if (correctCitySlug && correctCitySlug !== cityParam) {
        router.replace(`/directory/${correctCitySlug}/${username}`);
        return;
      }

      setProfile(p);
      const { data: pr } = await supabase.from("products").select("*").eq("profile_id", p.id);
      setProducts(pr || []);
      const { data: sl } = await supabase.from("social_links").select("*").eq("profile_id", p.id);
      setSocials(sl || []);
      const { data: tm } = await supabase.from("testimonials").select("*").eq("profile_id", p.id).order("sort_order", { ascending: true });
      setTestimonials(tm || []);
      // Gallery table is optional — fails silently if it doesn't exist with these columns.
      try {
        const { data: gl } = await supabase.from("gallery").select("*").eq("profile_id", p.id);
        setGallery(gl || []);
      } catch (e) {
        setGallery([]);
      }
      // Related businesses: same category, excluding this profile
      if (p.category) {
        const { data: rel } = await supabase
          .from("profiles")
          .select("*")
          .eq("category", p.category)
          .eq("is_active", true)
          .neq("username", username)
          .limit(4);
        setRelated(rel || []);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [username, cityParam, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-blue-600 text-xl font-semibold animate-pulse">Loading Profile...</div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-700">Listing Not Found</h1>
        <p className="text-gray-500 mt-2">smartprofile.in/directory/{cityParam}/{username} does not exist</p>
      </div>
    </div>
  );

  return <BusinessProfile profile={profile} products={products} socials={socials} testimonials={testimonials} gallery={gallery} related={related} />;
}