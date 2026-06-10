'use client';
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function ProfilePage({ params }) {
  const { username } = React.use(params);
  const [profile, setProfile] = useState(null);
  const [sections, setSections] = useState({});
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/profile/public?username=${username}`);
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setSections(data.sections || {});
        const qr = await QRCode.toDataURL(`https://smartprofile.in/${username}`);
        setQrCode(qr);
      }
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500">Loading profile...</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800 mb-2">Profile not found</p>
        <a href="/" className="text-orange-500 underline">Go to SmartProfile.in</a>
      </div>
    </div>
  );

  const plan = profile.plan || 'basic';
  const plans = ['basic','business','premium','ultimate'];
  const planIndex = plans.indexOf(plan);
  const has = (minPlan) => planIndex >= plans.indexOf(minPlan);

  const planColors = {
    basic: { bg: 'bg-[#1a2744]', accent: '#22c55e', btn: 'bg-green-500' },
    business: { bg: 'bg-[#1a2744]', accent: '#3b82f6', btn: 'bg-blue-600' },
    premium: { bg: 'bg-[#1a2744]', accent: '#f97316', btn: 'bg-orange-500' },
    ultimate: { bg: 'bg-[#1a2744]', accent: '#7c3aed', btn: 'bg-purple-600' },
  };
  const col = planColors[plan] || planColors.basic;

  const profileUrl = `https://smartprofile.in/${username}`;
  const phone = profile.mobile || '';

  function saveContact() {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.full_name || profile.business_name}\nORG:${profile.business_name || ''}\nTEL:${phone}\nEMAIL:${profile.email || ''}\nURL:${profileUrl}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${profile.full_name || username}.vcf`; a.click();
  }

  function shareProfile() {
    if (navigator.share) {
      navigator.share({ title: profile.business_name, url: profileUrl });
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert('Link copied!');
    }
  }

  const socialIcons = {
    facebook: { color: '#1877f2', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
    instagram: { color: '#e4405f', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>' },
    linkedin: { color: '#0a66c2', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
    youtube: { color: '#ff0000', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
    twitter: { color: '#1da1f2', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>' },
    whatsapp: { color: '#25d366', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen">

        {/* HEADER — plan-based */}
        {has('business') && profile.banner_url ? (
          <div className="relative">
            <img src={profile.banner_url} alt="banner" className="w-full h-40 object-cover" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                {profile.logo_url ? <img src={profile.logo_url} alt="logo" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🏢</div>}
              </div>
            </div>
          </div>
        ) : (
          <div className={`${col.bg} pt-8 pb-14 flex flex-col items-center relative`}>
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {profile.logo_url ? <img src={profile.logo_url} alt="logo" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🏢</div>}
            </div>
          </div>
        )}

        {/* NAME & INFO */}
        <div className={`text-center px-4 ${has('business') && profile.banner_url ? 'mt-12 pt-2' : 'py-4'}`}>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || profile.business_name}</h1>
            {plan === 'ultimate' && <span className="text-blue-500 text-lg">✓</span>}
          </div>
          {profile.designation && <p className="font-semibold mt-0.5" style={{color: col.accent}}>{profile.designation}</p>}
          {profile.city && <p className="text-gray-500 text-sm mt-1">📍 {profile.city}{profile.state ? `, ${profile.state}` : ''}</p>}
        </div>

        {/* STATS */}
        {(profile.stat1_value || profile.stat2_value || profile.stat3_value) && (
          <div className="mx-4 mt-3 bg-gray-50 rounded-xl p-3 flex justify-around border border-gray-100">
            {profile.stat1_value && <div className="text-center"><p className="font-bold text-gray-800">{profile.stat1_value}</p><p className="text-xs text-gray-500">{profile.stat1_label || 'Years'}</p></div>}
            {profile.stat2_value && <div className="text-center"><p className="font-bold text-gray-800">{profile.stat2_value}</p><p className="text-xs text-gray-500">{profile.stat2_label || 'Deals'}</p></div>}
            {profile.stat3_value && <div className="text-center"><p className="font-bold text-gray-800">{profile.stat3_value}</p><p className="text-xs text-gray-500">{profile.stat3_label || 'Clients'}</p></div>}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="px-4 mt-4 grid grid-cols-3 gap-2">
          {phone && <a href={`tel:${phone}`} className="flex flex-col items-center justify-center bg-green-500 text-white rounded-xl py-3 gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            <span className="text-xs font-semibold">Call</span>
          </a>}
          {phone && <a href={`https://wa.me/${phone.replace(/[^0-9]/g,'')}`} target="_blank" className="flex flex-col items-center justify-center bg-green-500 text-white rounded-xl py-3 gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>}
          <button onClick={saveContact} className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-xl py-3 gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
            <span className="text-xs font-semibold">Save Contact</span>
          </button>
        </div>

        {/* SECONDARY BUTTONS */}
        <div className="px-4 mt-2 grid grid-cols-3 gap-2">
          {profile.email && <a href={`mailto:${profile.email}`} className="flex flex-col items-center justify-center border border-gray-200 rounded-xl py-3 gap-1 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span className="text-xs font-medium">Email</span>
          </a>}
          {profile.website && <a href={profile.website} target="_blank" className="flex flex-col items-center justify-center border border-gray-200 rounded-xl py-3 gap-1 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            <span className="text-xs font-medium">Website</span>
          </a>}
          {has('business') && profile.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(profile.address)}`} target="_blank" className="flex flex-col items-center justify-center border border-gray-200 rounded-xl py-3 gap-1 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="text-xs font-medium">Location</span>
          </a>}
        </div>
        {/* ABOUT US */}
        {has('business') && profile.about && (
          <div className="mx-4 mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div>
                <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <span style={{color: col.accent}}>👤</span> About Us
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.about}</p>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT ROWS */}
        {has('business') && (
          <div className="mx-4 mt-4 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {profile.mobile && <a href={`tel:${profile.mobile}`} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              <span className="text-sm text-gray-700">{profile.mobile}</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </a>}
            {profile.email && <a href={`mailto:${profile.email}`} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span className="text-sm text-gray-700">{profile.email}</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </a>}
            {profile.website && <a href={profile.website} target="_blank" className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              <span className="text-sm text-gray-700">{profile.website}</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </a>}
            {profile.address && <div className="flex items-start gap-3 px-4 py-3 border-b border-gray-50">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              <span className="text-sm text-gray-700">{profile.address}</span>
            </div>}
            {profile.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(profile.address)}`} target="_blank" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
              <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span className="text-sm font-medium text-blue-500">View on Google Maps</span>
              <svg className="w-4 h-4 text-blue-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </a>}
          </div>
        )}

        {/* SOCIAL LINKS */}
        {sections.social_links?.length > 0 && (
          <div className="mx-4 mt-4">
            <h3 className="font-bold text-gray-800 mb-3 text-center">Connect With Us</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {sections.social_links.map((s, i) => {
                const icon = socialIcons[s.platform?.toLowerCase()];
                return (
                  <a key={i} href={s.url} target="_blank" className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{backgroundColor: icon?.color || '#666'}}>
                      <div className="w-6 h-6" dangerouslySetInnerHTML={{__html: icon?.svg || '🔗'}} />
                    </div>
                    <span className="text-xs text-gray-600 capitalize">{s.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {sections.products?.length > 0 && (
          <div className="mx-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">Our Top Products ({sections.products.length})</h3>
              {sections.products.length > 2 && <button className="text-sm font-medium" style={{color: col.accent}}>View All ›</button>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sections.products.map((p, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-28 object-cover" />}
                  <div className="p-2">
                    <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                    {p.description && <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>}
                    {p.price && <p className="text-xs font-bold mt-1" style={{color: col.accent}}>{p.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {sections.services?.length > 0 && (
          <div className="mx-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">Our Services ({sections.services.length})</h3>
              {sections.services.length > 2 && <button className="text-sm font-medium" style={{color: col.accent}}>View All ›</button>}
            </div>
            <div className="space-y-2">
              {sections.services.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg flex-shrink-0" style={{backgroundColor: col.accent}}>🏠</div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{s.name}</p>
                    {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {has('premium') && sections.gallery?.length > 0 && (
          <div className="mx-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">Gallery ({sections.gallery.length} Photos)</h3>
              {sections.gallery.length > 3 && <button className="text-sm font-medium" style={{color: col.accent}}>View All ›</button>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sections.gallery.slice(0, 6).map((g, i) => (
                <img key={i} src={g.image_url} alt="" className="w-full h-24 object-cover rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {has('business') && sections.testimonials?.length > 0 && (
          <div className="mx-4 mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800">Testimonials ({sections.testimonials.length})</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sections.testimonials.map((t, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex gap-0.5 mb-2">{'★★★★★'.split('').map((s,j)=><span key={j} className="text-yellow-400 text-sm">{s}</span>)}</div>
                  <p className="text-xs text-gray-600 italic">"{t.review}"</p>
                  <p className="text-xs font-semibold text-gray-800 mt-2">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF BROCHURE + BUSINESS PRESENCE */}
        {has('premium') && (profile.brochure_url || sections.business_links?.length > 0) && (
          <div className="mx-4 mt-5 flex gap-3">
            {profile.brochure_url && (
              <a href={profile.brochure_url} target="_blank" className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500 text-lg">📄</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">PDF Brochure</p>
                  <button className="text-xs text-orange-500 font-medium mt-0.5">Download Brochure</button>
                </div>
              </a>
            )}
            {sections.business_links?.length > 0 && (
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-800 mb-2">Business Presence ({sections.business_links.length})</p>
                <div className="flex gap-2 flex-wrap">
                  {sections.business_links.map((b, i) => (
                    <a key={i} href={b.url} target="_blank" className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-700">{b.platform}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LEAD FORM */}
        {has('ultimate') && profile.enquiry_form && (
          <div className="mx-4 mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-bold text-gray-800 mb-3">Send Enquiry</h3>
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 bg-white" placeholder="Your Name" />
            <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 bg-white" placeholder="Mobile Number" />
            <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 bg-white" rows={3} placeholder="Your message..." />
            <button className="w-full text-white py-2.5 rounded-xl font-semibold text-sm" style={{backgroundColor: col.accent}}>Send Enquiry</button>
          </div>
        )}

        {/* QR CODE */}
        <div className="mx-4 mt-5 bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-4">
          {qrCode && <img src={qrCode} alt="QR" className="w-20 h-20" />}
          <div className="flex-1">
            <p className="font-bold text-gray-800">Share My Profile</p>
            <p className="text-xs text-gray-500 mt-0.5">Scan QR code to save my details instantly.</p>
            <button onClick={shareProfile} className="mt-2 flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-lg" style={{backgroundColor: col.accent}}>
              🔗 Share Profile
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center py-6 mt-4">
          <p className="text-xs text-gray-400">Powered by</p>
          <a href="https://smartprofile.in" className="text-sm font-bold"><span className="text-gray-800">Smart</span><span className="text-orange-500">Profile</span><span className="text-gray-800">.in</span></a>
          <p className="text-xs text-gray-400 mt-1">One Profile. Complete Business.</p>
          {plan !== 'ultimate' && <a href="https://smartprofile.in" className="text-xs text-orange-500 font-medium mt-1 block">Create Your Own Smart Profile →</a>}
        </div>

      </div>
    </div>
  );
}