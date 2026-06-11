"use client";
import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "Real Estate", icon: "🏠" },
  { name: "Doctors", icon: "🩺" },
  { name: "Restaurants", icon: "🍽️" },
  { name: "Salons", icon: "✂️" },
  { name: "Education", icon: "🎓" },
  { name: "Automotive", icon: "🚗" },
  { name: "Dentists", icon: "🦷" },
  { name: "Manufacturers", icon: "🏭" },
  { name: "Consultants", icon: "💼" },
  { name: "Physiotherapy", icon: "🏃" },
  { name: "Travel Agents", icon: "✈️" },
  { name: "More", icon: "•••" },
];

const businesses = [
  { name: "Dream Home Realty", category: "Real Estate", city: "Mumbai", state: "Maharashtra", rating: 4.8, reviews: 128, verified: true },
  { name: "Dr. Amit Sharma", category: "Doctors", city: "Pune", state: "Maharashtra", rating: 4.8, reviews: 112, verified: true },
  { name: "Bright Smile Dental", category: "Dentists", city: "Chennai", state: "Tamil Nadu", rating: 4.7, reviews: 68, verified: true },
  { name: "Spice Garden", category: "Restaurants", city: "Jaipur", state: "Rajasthan", rating: 4.5, reviews: 104, verified: true },
  { name: "Active Physio Care", category: "Physiotherapy", city: "Kolkata", state: "West Bengal", rating: 4.6, reviews: 73, verified: true },
  { name: "Cool Breeze AC Care", category: "Automotive", city: "Delhi", state: "Delhi", rating: 4.6, reviews: 84, verified: true },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-sm font-semibold text-gray-700 ml-1">{rating}</span>
    </div>
  );
}

export default function Directory() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All India");
  const [category, setCategory] = useState("All Categories");

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Find Trusted Businesses<br/>
              <span className="text-blue-600">Across India</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">Search, discover and connect with verified businesses and professionals in your city.</p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search business or service..." className="flex-1 outline-none text-gray-700 py-2" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
              <select className="px-4 py-2 border-l border-gray-200 outline-none text-gray-600 bg-white" value={city} onChange={e => setCity(e.target.value)}>
                <option>All India</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Pune</option>
                <option>Bangalore</option>
                <option>Chennai</option>
                <option>Hyderabad</option>
                <option>Kolkata</option>
                <option>Jaipur</option>
                <option>Mira Road</option>
                <option>Thane</option>
              </select>
              <select className="px-4 py-2 border-l border-gray-200 outline-none text-gray-600 bg-white" value={category} onChange={e => setCategory(e.target.value)}>
                <option>All Categories</option>
                {categories.map(c => <option key={c.name}>{c.name}</option>)}
              </select>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">Search</button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Verified Businesses
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/></svg>
                Direct Contact
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                100% Trusted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Categories</h2>
          <button className="text-blue-600 font-medium hover:underline">View all categories →</button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setCategory(cat.name)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition hover:border-blue-400 hover:bg-blue-50 ${category === cat.name ? "border-blue-500 bg-blue-50" : "border-gray-100"}`}>
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 text-center font-medium leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Businesses */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Businesses</h2>
          <button className="text-blue-600 font-medium hover:underline">View all businesses →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map(biz => (
            <div key={biz.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600 flex-shrink-0">
                  {biz.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{biz.name}</h3>
                    {biz.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{biz.category}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    {biz.city}, {biz.state}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <StarRating rating={biz.rating} />
                <span className="text-sm text-gray-400">({biz.reviews} reviews)</span>
              </div>
              <div className="flex gap-2">
                <Link href="#" className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">View Profile</Link>
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z"/></svg>
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-blue-600 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center text-white">
          {[
            { num: "500+", label: "Verified Businesses" },
            { num: "50+", label: "Cities Covered" },
            { num: "20+", label: "Business Categories" },
            { num: "1000+", label: "Monthly Searches" },
            { num: "4.7/5", label: "Average Rating" },
            { num: "24/7", label: "Support" },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold mb-1">{s.num}</div>
              <div className="text-blue-100 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you a business owner?</h2>
            <p className="text-gray-600">Create your digital profile and get discovered by thousands of potential customers across India.</p>
          </div>
          <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition whitespace-nowrap">
            List Your Business Free →
          </Link>
        </div>
      </div>

    </div>
  );
}
