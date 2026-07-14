"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "", color: "text-gray-400", bar: "bg-gray-200", width: "0%" };
    if (pass.length < 6) return { label: "Weak", color: "text-red-500", bar: "bg-red-500", width: "25%" };
    if (pass.length < 8) return { label: "Medium", color: "text-amber-500", bar: "bg-amber-500", width: "50%" };
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return { label: "Strong", color: "text-emerald-500", bar: "bg-emerald-500", width: "100%" };
    return { label: "Good", color: "text-blue-500", bar: "bg-blue-500", width: "75%" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match!"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); }
      else { router.push("/login?registered=true"); }
    } catch { setError("Something went wrong"); setLoading(false); }
  };

  const inputClass = "w-full py-2.5 pl-10 pr-3.5 border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-indigo-500 box-border";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#faf5ff] to-[#eff6ff]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-[60px] items-center lg:min-h-[85vh]">

          {/* LEFT */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-blue-500 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Join 10,000+ Professionals
            </div>
            <h1 className="text-[28px] sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Create Your Digital Identity<br />
              Join <span className="bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-transparent">SmartProfile</span>
            </h1>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-8">Build your professional identity, share instantly and grow your connections.</p>
            <div className="flex flex-col gap-6 mb-8">
              {[
                { icon: "👤", bg: "from-indigo-500 to-violet-500", title: "Professional Identity", desc: "Create your digital identity in minutes and stand out professionally." },
                { icon: "🛡️", bg: "from-emerald-500 to-emerald-600", title: "Secure & Private", desc: "Your data is 100% secure and never shared with anyone." },
                { icon: "🤝", bg: "from-violet-500 to-violet-600", title: "Grow Your Network", desc: "Connect, share and grow your business across India." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-[52px] h-[52px] bg-gradient-to-br ${item.bg} rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-[0_4px_16px_rgba(99,102,241,0.25)]`}>{item.icon}</div>
                  <div>
                    <div className="font-bold text-[15px] text-slate-900 mb-0.5">{item.title}</div>
                    <div className="text-[13px] text-slate-500 leading-normal">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl px-5 py-4.5 flex items-center gap-3.5 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
              <div className="flex shrink-0">
                {["#6366f1","#8b5cf6","#10b981","#f59e0b","#ef4444"].map((c,i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[11px] text-white font-bold" style={{ background: c, marginLeft: i > 0 ? -8 : 0 }}>{i === 4 ? "10K+" : ""}</div>
                ))}
              </div>
              <div>
                <div className="font-bold text-[13px] text-slate-900">Trusted by 10,000+ Professionals</div>
                <div className="text-xs text-slate-500">Join the SmartProfile community today!</div>
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="order-1 lg:order-2 bg-white rounded-3xl px-5 py-8 sm:px-9 sm:py-10 shadow-[0_20px_60px_rgba(99,102,241,0.1)] border border-gray-200">
            <div className="text-center mb-7">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3.5">
                <Image src="/logo-icon.png" alt="SmartProfile" width={56} height={56} priority />
              </div>
              <h2 className="text-[22px] font-extrabold text-slate-900 mb-1">Create Your Account 🎉</h2>
              <p className="text-[13px] text-slate-500">Join SmartProfile — it's free to get started</p>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-[10px] px-3.5 py-2.5 text-red-600 text-[13px] mb-4.5">{error}</div>}
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required className={inputClass} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className={inputClass} />
                </div>
              </div>
              <div className="mb-1.5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required className="w-full py-2.5 pl-10 pr-11 border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-indigo-500 box-border" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0">
                    {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              {formData.password && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-slate-500">Password strength:</span>
                    <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded overflow-hidden">
                    <div className={`h-full ${strength.bar} rounded transition-all duration-300`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
              <div className="mb-5.5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required className="w-full py-2.5 pl-10 pr-11 border-[1.5px] border-gray-200 rounded-[10px] text-sm outline-none focus:border-indigo-500 box-border" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0">
                    {showConfirm ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-br from-indigo-500 to-violet-500 text-white border-none rounded-[10px] text-[15px] font-bold shadow-[0_4px_16px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
                {loading ? "Creating Account..." : "Register Now →"}
              </button>
            </form>
            <div className="flex items-center gap-2.5 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-slate-400">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { name: "Google", svg: <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { name: "LinkedIn", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { name: "Microsoft", svg: <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M13 1h10v10H13z"/><path fill="#7FBA00" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg> },
              ].map((btn, i) => (
                <button key={i} className="py-2.5 px-2 border-[1.5px] border-gray-200 rounded-[10px] bg-white cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700">
                  {btn.svg} <span className="hidden sm:inline">{btn.name}</span>
                </button>
              ))}
            </div>
            <div className="text-center text-[13px] text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-500 font-bold no-underline">Login now</Link>
            </div>
          </div>

        </div>

        {/* BOTTOM STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8 sm:mt-10 pt-7 sm:pt-8 border-t border-gray-200">
          {[
            { icon: "🔒", title: "100% Secure", desc: "Your data is protected" },
            { icon: "⚡", title: "Easy to Use", desc: "Setup in less than 2 minutes" },
            { icon: "🎧", title: "24/7 Support", desc: "We're here to help anytime" },
            { icon: "🇮🇳", title: "Made in India", desc: "For professionals across India" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-[10px] flex items-center justify-center text-lg shrink-0">{item.icon}</div>
              <div>
                <div className="font-bold text-[13px] text-slate-900">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}