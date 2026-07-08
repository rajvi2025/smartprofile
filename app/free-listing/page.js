"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

const categories = ["Real Estate", "AC Repairing", "Doctor", "Dentist", "Physiotherapy", "Salon", "Restaurant", "Education", "Travel Agent", "Automotive", "Other"];

function slugify(name) {
  const base = (name || "business")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}-${suffix}`;
}

export default function FreeListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    business_type: "Services",
    category: "",
    full_name: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    address: "",
    about: "",
    website: "",
    business_id_type: "GST",
    business_id_number: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.business_name || !form.category || !form.phone || !form.city || !form.business_id_number) {
      setError("Please fill all required fields marked with *");
      return;
    }

    setSubmitting(true);
    const username = slugify(form.business_name);

    const { error: insertError } = await supabase.from("profiles").insert([{
      username,
      business_name: form.business_name,
      business_type: form.business_type,
      category: form.category,
      full_name: form.full_name || null,
      phone: form.phone,
      whatsapp: form.whatsapp || form.phone,
      email: form.email || null,
      city: form.city,
      state: form.state || null,
      address: form.address || null,
      about: form.about || null,
      website: form.website || null,
      business_id_type: form.business_id_type,
      business_id_number: form.business_id_number,
      plan: "free",
      status: "pending",
      is_active: false,
    }]);

    setSubmitting(false);

    if (insertError) {
      setError("Something went wrong: " + insertError.message);
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Listing Submitted!</h1>
          <p className="text-gray-500 text-sm mb-6">
            Thanks! Your business has been submitted for review. Once approved by our team, it will appear live in the SmartProfile Business Directory — usually within 24 hours.
          </p>

          <div className="rounded-xl p-4 mb-4 text-white text-left" style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}>
            <p className="font-bold text-sm mb-1">💳 One more thing...</p>
            <p className="text-xs text-blue-100 mb-3 leading-relaxed">
              A free listing gets you found. A Digital Visiting Card gets you remembered — photos, reviews, NFC tap-to-share and a premium spot above free listings. Starting ₹199/year.
            </p>
            <a href="/register" className="inline-block bg-white text-blue-700 font-bold text-xs px-4 py-2 rounded-lg">
              Create Your Digital Visiting Card →
            </a>
          </div>

          <a href="/directory" className="inline-block text-gray-500 text-sm font-medium">
            Or just browse the directory →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">List Your Business — Free</h1>
          <p className="text-gray-500 text-sm mt-1">
            Get listed in the SmartProfile Business Directory at no cost. No digital card, no NFC, no payment — just your business, discoverable by customers near you.
          </p>
        </div>

        {/* Upsell: paid digital visiting card */}
        <div className="rounded-2xl p-5 mb-6 text-white flex flex-col sm:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, #1e40af, #3b82f6)" }}>
          <div className="text-4xl">💳</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-base">Want more than just a listing?</p>
            <p className="text-sm text-blue-100 mt-1">
              Get your own Digital Visiting Card — photo, About Us, products, unlimited reviews, NFC tap-to-share card & a premium spot in the directory. Starting at just ₹199/year.
            </p>
          </div>
          <a href="/register" className="bg-white text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl whitespace-nowrap">
            Create Your Digital Visiting Card →
          </a>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name *</label>
            <input value={form.business_name} onChange={(e) => update("business_name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Sharma Properties" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Type</label>
            <div className="flex gap-3">
              {["Services", "Products", "Professional"].map((t) => (
                <button type="button" key={t} onClick={() => update("business_type", t)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${form.business_type === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
              <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Owner name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="10-digit mobile" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp</label>
              <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Same as phone if blank" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="business@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City *</label>
              <input value={form.city} onChange={(e) => update("city", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Thane" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input value={form.state} onChange={(e) => update("state", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Maharashtra" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
            <input value={form.address} onChange={(e) => update("address", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Shop no, street, area" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">About Your Business</label>
            <textarea value={form.about} onChange={(e) => update("about", e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Briefly describe what you do" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Website (optional)</label>
            <input value={form.website} onChange={(e) => update("website", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="https://" />
          </div>

          {/* Business ID — compulsory for free listing */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <label className="block text-sm font-bold text-gray-800 mb-2">Business Identification Number *</label>
            <p className="text-xs text-gray-500 mb-3">Required to verify your business and prevent spam listings.</p>
            <div className="grid grid-cols-3 gap-3">
              <select value={form.business_id_type} onChange={(e) => update("business_id_type", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
                <option value="GST">GST</option>
                <option value="UDYAM">UDYAM</option>
                <option value="PAN">PAN</option>
              </select>
              <input value={form.business_id_number} onChange={(e) => update("business_id_number", e.target.value.toUpperCase())}
                className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={`Enter ${form.business_id_type} number`} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold text-sm py-3 rounded-xl disabled:opacity-60">
            {submitting ? "Submitting..." : "Submit for Free Listing"}
          </button>
          <p className="text-xs text-gray-400 text-center">Your listing will be reviewed by our team before going live.</p>
        </form>
      </div>
    </div>
  );
}