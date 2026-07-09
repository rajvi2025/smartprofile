"use client";
import { useEffect, useState, use } from "react";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

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

// ---------- DIGITAL CARD: simple narrow vCard-style design ----------
function BasicProfile({ profile }) {
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
          <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || profile.business_name}</h1>
          {profile.designation && <p className="text-orange-500 font-semibold text-sm mt-1">{profile.designation}</p>}
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

export default function ProfilePage({ params }) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: p } = await supabase.from("profiles").select("*").eq("username", username).single();
      setProfile(p || null);
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

  return <BasicProfile profile={profile} />;
}