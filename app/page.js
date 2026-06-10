"use client";
import { useState } from "react";

const THEMES = {
  ocean:   { name: "Ocean",   headerBg: "from-blue-600 via-cyan-500 to-teal-500",       accent: "#0891b2" },
  sunset:  { name: "Sunset",  headerBg: "from-orange-500 via-rose-500 to-pink-500",     accent: "#e11d48" },
  forest:  { name: "Forest",  headerBg: "from-green-600 via-emerald-500 to-teal-500",   accent: "#059669" },
  royal:   { name: "Royal",   headerBg: "from-violet-700 via-purple-600 to-indigo-600", accent: "#7c3aed" },
  luxury:  { name: "Luxury",  headerBg: "from-yellow-600 via-amber-500 to-yellow-700",  accent: "#d97706" },
};

const PLANS = [
  { key: "basic",    label: "Basic",    price: "₹199" },
  { key: "business", label: "Business", price: "₹399" },
  { key: "premium",  label: "Premium",  price: "₹599" },
  { key: "ultimate", label: "Ultimate", price: "₹999" },
];

const TYPES = [
  { key: "services",     label: "Services",     icon: "🏠" },
  { key: "products",     label: "Products",     icon: "🛍️" },
  { key: "professional", label: "Professional", icon: "👔" },
];

const profile = {
  name: "Rajesh Sharma",
  title: "Real Estate Consultant",
  company: "Sharma Properties",
  location: "Kalyan, Maharashtra",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "rajesh@sharmaproperties.in",
  website: "www.sharmaproperties.in",
  address: "Shop No. 12, 2nd Floor, City Center, Kalyan (W), Maharashtra 421301",
  about: "Helping families find their dream homes across Mumbai and Thane region. We provide trusted real estate solutions with transparency and best service.",
  stats: [
    { value: "12+",  label: "Years",        icon: "👤" },
    { value: "200+", label: "Deals",        icon: "🤝" },
    { value: "500+", label: "Happy Clients",icon: "😊" },
  ],
  // Services
  services: [
    { name: "Residential Sales",   desc: "Perfect home for your family.",        icon: "🏠" },
    { name: "Commercial Deals",    desc: "Buying, selling & leasing.",            icon: "🏢" },
    { name: "Rental Services",     desc: "Find best rental properties.",          icon: "🔑" },
    { name: "Investment Advice",   desc: "Smart property investment guidance.",   icon: "📈" },
    { name: "Property Management", desc: "Complete management solutions.",        icon: "📋" },
  ],
  // Products
  products: [
    { name: "2 BHK Apartment",  desc: "Spacious flats in prime location.", icon: "🏢" },
    { name: "3 BHK Villa",      desc: "Premium villas with amenities.",    icon: "🏡" },
    { name: "Commercial Space", desc: "Office spaces for rent & sale.",    icon: "🏬" },
    { name: "Studio Apartment", desc: "Affordable studio apartments.",     icon: "🏠" },
    { name: "Penthouse",        desc: "Luxury penthouses with city view.", icon: "🌆" },
  ],
  // Professional
  professional: [
    { name: "Property Consultation", desc: "Expert advice on property deals.",    icon: "💼" },
    { name: "Legal Documentation",   desc: "Complete legal paperwork support.",   icon: "📄" },
    { name: "Site Visits",           desc: "Guided property site visits.",        icon: "🗺️" },
    { name: "Loan Assistance",       desc: "Home loan guidance & processing.",    icon: "🏦" },
    { name: "NRI Services",          desc: "Special services for NRI clients.",   icon: "✈️" },
  ],
  gallery: ["🏙️","🌆","🏘️","🏗️","🌇","🏛️","🏰","🌃","🏠","🏡","🌉","🏝️","🌄","🏔️","🗺️","🌅","🌁","🌃","🏙️","🌆"],
  testimonials: [
    { text: "Excellent service and great support throughout the property buying process.", name: "Neha Deshmukh", stars: 5 },
    { text: "Very professional team and smooth experience. Highly recommended!", name: "Amit Patil", stars: 5 },
    { text: "Best real estate consultant in Kalyan. Found my dream home!", name: "Priya Shah", stars: 5 },
  ],
  socials: [
    { name: "Facebook",  bg: "bg-blue-600", letter: "f" },
    { name: "Instagram", bg: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600", letter: "ig" },
    { name: "LinkedIn",  bg: "bg-blue-700", letter: "in" },
    { name: "YouTube",   bg: "bg-red-600",  letter: "yt" },
  ],
  bizPresence: [
    { name: "Google", short: "G",  color: "text-red-500 border-red-200" },
    { name: "IndiaMART", short: "M", color: "text-green-600 border-green-200" },
    { name: "JustDial",  short: "Jd", color: "text-blue-600 border-blue-200" },
    { name: "Sulekha",   short: "S",  color: "text-orange-500 border-orange-200" },
    { name: "TradeIndia",short: "T",  color: "text-blue-500 border-blue-200" },
  ],
};

function Stars({ n }) {
  return <div className="flex gap-0.5">{Array(n).fill(0).map((_,i)=><span key={i} className="text-yellow-400 text-sm">★</span>)}</div>;
}
function PhoneIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.02l-2.2 2.2z"/></svg>; }
function WAIcon()    { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.121 1.527 5.849L.057 23.97l6.283-1.648A11.947 11.947 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.73.978.995-3.638-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>; }
function SaveIcon()  { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>; }
function LocIcon()   { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>; }
function EmailIcon() { return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5z"/></svg>; }
function WebIcon()   { return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a7.96 7.96 0 010-4h3.38a16.5 16.5 0 000 4H4.26zm.81 2h2.95c.3 1.27.78 2.49 1.38 3.56A7.99 7.99 0 015.07 16zm2.95-8H5.07a7.99 7.99 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82A15.4 15.4 0 0112 19.96zM14.34 14H9.66a14.7 14.7 0 010-4h4.68a14.7 14.7 0 010 4zm.25 5.56c.6-1.07 1.08-2.29 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14a16.5 16.5 0 000-4h3.38a7.96 7.96 0 010 4h-3.38z"/></svg>; }
function PinIcon()   { return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>; }
function ShareIcon() { return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>; }

// Same grid component for all 3 types
function ItemGrid({ items, count, title, accent, headerBg }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800 text-sm">{title} ({count})</h3>
        <button className="text-xs font-medium" style={{ color: accent }}>View All ›</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.slice(0, Math.min(count, 4)).map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
            <div className={`h-20 bg-gradient-to-br ${headerBg} flex items-center justify-center text-4xl opacity-80`}>
              {item.icon}
            </div>
            <div className="p-2">
              <p className="font-semibold text-xs text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SmartProfileDemo() {
  const [plan,  setPlan]  = useState("basic");
  const [theme, setTheme] = useState("ocean");
  const [type,  setType]  = useState("services");
  const t = THEMES[theme];
  const accent = t.accent;

  const isBusiness = plan !== "basic";
  const isPremium  = plan === "premium" || plan === "ultimate";
  const isUltimate = plan === "ultimate";

  const socialCount      = plan === "basic" ? 0 : plan === "business" ? 2 : plan === "premium" ? 4 : 10;
  const itemCount        = plan === "basic" ? 0 : plan === "business" ? 2 : plan === "premium" ? 5 : 10;
  const galleryCount     = isPremium ? (isUltimate ? 20 : 10) : 0;
  const testimonialCount = isPremium ? (isUltimate ? 10 : 5) : 0;
  const bizCount         = isPremium ? (isUltimate ? 5 : 3) : 0;

  const currentItems = type === "services" ? profile.services : type === "products" ? profile.products : profile.professional;
  const currentTitle = type === "services" ? "Our Services" : type === "products" ? "Our Products" : "Our Work";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-2">

      {/* Step 1 — Plan */}
      <div className="w-full max-w-sm mb-3">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 text-center">Step 1 — Choose Plan</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {PLANS.map((p) => (
            <button key={p.key} onClick={() => setPlan(p.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow ${plan === p.key ? "text-white scale-105" : "bg-white text-gray-600"}`}
              style={plan === p.key ? { backgroundColor: accent } : {}}>
              {p.label} {p.price}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Theme */}
      <div className="w-full max-w-sm mb-3">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 text-center">Step 2 — Choose Theme</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {Object.entries(THEMES).map(([key, val]) => (
            <button key={key} onClick={() => setTheme(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 ${theme === key ? "text-white border-transparent scale-105" : "bg-white text-gray-500 border-gray-200"}`}
              style={theme === key ? { backgroundColor: val.accent } : {}}>
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 — Type */}
      <div className="w-full max-w-sm mb-6">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 text-center">Step 3 — Choose Profile Type</p>
        <div className="flex gap-2 justify-center">
          {TYPES.map((tp) => (
            <button key={tp.key} onClick={() => setType(tp.key)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${type === tp.key ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200"}`}
              style={type === tp.key ? { backgroundColor: accent } : {}}>
              <div className="text-xl mb-1">{tp.icon}</div>
              <div>{tp.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        {isBusiness ? (
          <div className="relative">
            <div className={`h-40 bg-gradient-to-br ${t.headerBg} flex items-center justify-center overflow-hidden`}>
              <div className="text-8xl opacity-20">🏙️</div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-10">
              <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.headerBg} flex items-center justify-center text-white text-xs font-bold text-center leading-tight`}>
                  SHARMA<br/>PROP
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-8 flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-100 shadow-lg flex items-center justify-center text-4xl">🏢</div>
          </div>
        )}

        {/* Profile Info */}
        <div className={`text-center px-4 ${isBusiness ? "pt-14 pb-3" : "pt-3 pb-3"}`}>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="font-semibold mt-0.5" style={{ color: accent }}>{profile.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">📍 {profile.location}</p>
        </div>

        {/* Basic Stats */}
        {plan === "basic" && (
          <div className="mx-4 mb-3 border border-gray-200 rounded-xl">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              {profile.stats.map((s, i) => (
                <div key={i} className="text-center py-3">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="font-bold text-gray-800">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic: 3+3 Buttons */}
        {plan === "basic" && (
          <>
            <div className="grid grid-cols-3 gap-2 px-4 mb-2">
              <button className="flex flex-col items-center gap-1 py-3 rounded-xl bg-green-500 text-white"><PhoneIcon /><span className="text-xs font-semibold">Call</span></button>
              <button className="flex flex-col items-center gap-1 py-3 rounded-xl bg-green-500 text-white"><WAIcon /><span className="text-xs font-semibold">WhatsApp</span></button>
              <button className="flex flex-col items-center gap-1 py-3 rounded-xl bg-blue-600 text-white"><SaveIcon /><span className="text-xs font-semibold">Save Contact</span></button>
            </div>
            <div className="grid grid-cols-3 gap-2 px-4 mb-4">
              <button className="flex flex-col items-center gap-1 border border-gray-200 py-3 rounded-xl text-gray-600"><EmailIcon /><span className="text-xs font-semibold">Email</span></button>
              <button className="flex flex-col items-center gap-1 border border-gray-200 py-3 rounded-xl text-gray-600"><WebIcon /><span className="text-xs font-semibold">Website</span></button>
              <button className="flex flex-col items-center gap-1 border border-gray-200 py-3 rounded-xl text-gray-600"><LocIcon /><span className="text-xs font-semibold">Location</span></button>
            </div>
          </>
        )}

        {/* Business+: 4 Buttons */}
        {isBusiness && (
          <div className="grid grid-cols-4 gap-2 px-4 mb-4">
            {[
              { label: "Call",         icon: <PhoneIcon />, color: "text-green-600 border-green-200" },
              { label: "WhatsApp",     icon: <WAIcon />,    color: "text-green-600 border-green-200" },
              { label: "Save Contact", icon: <SaveIcon />,  color: "text-blue-600 border-blue-200"  },
              { label: "Location",     icon: <LocIcon />,   color: "text-blue-600 border-blue-200"  },
            ].map((btn, i) => (
              <button key={i} className={`flex flex-col items-center gap-1 border py-2 rounded-xl ${btn.color}`}>
                {btn.icon}
                <span className="text-xs font-medium leading-tight text-center">{btn.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-6 space-y-4">

          {/* About */}
          <div className="rounded-xl p-4" style={{ backgroundColor: accent + "15" }}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span>👤</span>
                  <h3 className="font-bold text-sm" style={{ color: accent }}>About {isBusiness ? "Us" : "Me"}</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{profile.about}</p>
              </div>
              {isBusiness && <div className="text-4xl opacity-50">🏘️</div>}
            </div>
          </div>

          {/* Contact Rows */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {[
              { icon: <PhoneIcon />, text: profile.phone },
              { icon: <EmailIcon />, text: profile.email },
              { icon: <WebIcon />,   text: profile.website },
              ...(isBusiness ? [{ icon: <PinIcon />, text: profile.address }] : []),
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                <span className="text-gray-400">{row.icon}</span>
                <span className="text-sm text-gray-700 flex-1">{row.text}</span>
                <span className="text-gray-300">›</span>
              </div>
            ))}
            {isBusiness && (
              <div className="px-4 py-3 flex items-center gap-2">
                <span className="text-sm">🗺️</span>
                <span className="text-sm font-medium" style={{ color: accent }}>View on Google Maps</span>
                <span className="text-gray-300 ml-auto">›</span>
              </div>
            )}
          </div>

          {/* Socials */}
          {socialCount > 0 && (
            <div className="border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 text-center font-semibold mb-3">Connect With Us</p>
              <div className="flex justify-center gap-4 flex-wrap">
                {profile.socials.slice(0, socialCount).map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 ${s.bg} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{s.letter}</div>
                    <span className="text-xs text-gray-500">{s.name}</span>
                  </div>
                ))}
                {isUltimate && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">···</div>
                    <span className="text-xs text-gray-500">More</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Grid — same layout for Services, Products, Professional */}
          {itemCount > 0 && (
            <ItemGrid
              items={currentItems}
              count={itemCount}
              title={currentTitle}
              accent={accent}
              headerBg={t.headerBg}
            />
          )}

          {/* Gallery — Premium+ sabko */}
          {galleryCount > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-sm">Gallery ({galleryCount} Photos)</h3>
                <button className="text-xs font-medium" style={{ color: accent }}>View All ›</button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {profile.gallery.slice(0, 3).map((img, i) => (
                  <div key={i} className={`aspect-square bg-gradient-to-br ${t.headerBg} rounded-xl flex items-center justify-center text-3xl opacity-80`}>{img}</div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials — Premium+ sabko */}
          {testimonialCount > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800 text-sm">Testimonials ({testimonialCount})</h3>
                <button className="text-xs font-medium" style={{ color: accent }}>View All ›</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {profile.testimonials.slice(0, 2).map((t, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <Stars n={t.stars} />
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">"{t.text}"</p>
                    <p className="text-xs font-semibold text-gray-700 mt-2">— {t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF + Biz Presence */}
          {bizCount > 0 && (
            <div className="flex gap-3">
              <div className="flex-1 border border-gray-100 rounded-xl p-3 flex gap-2 items-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: accent + "20" }}>📄</div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">PDF Brochure</p>
                  <p className="text-xs text-gray-500">Company Profile.pdf</p>
                  <button className="text-xs text-white px-2 py-1 rounded-lg mt-1 font-medium" style={{ backgroundColor: accent }}>Download</button>
                </div>
              </div>
              <div className="flex-1 border border-gray-100 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Business Presence ({bizCount})</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.bizPresence.slice(0, bizCount).map((b, i) => (
                    <span key={i} className={`text-xs font-bold border rounded px-1.5 py-0.5 ${b.color}`}>{b.short}</span>
                  ))}
                </div>
                <button className="text-xs mt-1" style={{ color: accent }}>+ More</button>
              </div>
            </div>
          )}

          {/* Lead Form — Ultimate only */}
          {isUltimate && (
            <div className="border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-sm text-gray-800 mb-3">📋 Enquiry / Lead Form</h3>
              <input className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-2 outline-none" placeholder="Your Name" />
              <input className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-2 outline-none" placeholder="Phone Number" />
              <textarea className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mb-2 h-16 resize-none outline-none" placeholder="Your Message" />
              <button className="w-full text-white font-semibold py-2.5 rounded-xl text-sm" style={{ backgroundColor: accent }}>Send Enquiry</button>
            </div>
          )}

          {/* QR + Share */}
          <div className="border border-gray-100 rounded-xl p-4 flex gap-4 items-center">
            <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5">
                {Array(9).fill(0).map((_,i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm ${[0,2,4,6,8].includes(i) ? "bg-gray-800" : "bg-gray-300"}`}></div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-gray-800">Share My Profile</p>
              <p className="text-xs text-gray-500 mt-1">Scan QR code to save my details instantly.</p>
              <button className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-xl mt-2" style={{ backgroundColor: accent }}>
                <ShareIcon /> Share Profile
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">Powered by</p>
            <div className="flex items-center justify-center mt-1">
              <span className="font-bold text-sm text-gray-800">Smart</span>
              <span className="font-bold text-sm" style={{ color: accent }}>Profile</span>
              <span className="font-bold text-sm text-gray-800">.in</span>
            </div>
            <p className="text-xs mt-1" style={{ color: accent }}>Create Your Own Smart Profile →</p>
          </div>

        </div>
      </div>
    </div>
  );
}