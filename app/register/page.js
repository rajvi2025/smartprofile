"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "", color: "", width: "0%" };
    if (pass.length < 6) return { label: "Weak", color: "#ef4444", width: "25%" };
    if (pass.length < 8) return { label: "Medium", color: "#f59e0b", width: "50%" };
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/)) return { label: "Strong", color: "#10b981", width: "100%" };
    return { label: "Good", color: "#3b82f6", width: "75%" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match!"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); }
      else { router.push("/login?registered=true"); }
    } catch { setError("Something went wrong"); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #eff6ff 100%)", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 60, alignItems: "center", minHeight: "85vh" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#3b82f6", marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Join 10,000+ Professionals
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 16 }}>
              Create Your Digital Identity<br />
              Join <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SmartProfile</span>
            </h1>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 36 }}>Build your professional identity, share instantly and grow your connections.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 36 }}>
              {[
                { icon: "👤", bg: "linear-gradient(135deg, #6366f1, #8b5cf6)", title: "Professional Identity", desc: "Create your digital identity in minutes and stand out professionally." },
                { icon: "🛡️", bg: "linear-gradient(135deg, #10b981, #059669)", title: "Secure & Private", desc: "Your data is 100% secure and never shared with anyone." },
                { icon: "🤝", bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)", title: "Grow Your Network", desc: "Connect, share and grow your business across India." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 52, height: 52, background: item.bg, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: "0 4px 16px rgba(99,102,241,0.25)" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex" }}>
                {["#6366f1","#8b5cf6","#10b981","#f59e0b","#ef4444"].map((c,i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700 }}>{i === 4 ? "10K+" : ""}</div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>Trusted by 10,000+ Professionals</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Join the SmartProfile community today!</div>
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 20px 60px rgba(99,102,241,0.1)", border: "1px solid #e2e8f0" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Create Your Account 🎉</h2>
              <p style={{ fontSize: 13, color: "#64748b" }}>Join SmartProfile — it's free to get started</p>
            </div>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 14px", color: "#dc2626", fontSize: 13, marginBottom: 18 }}>{error}</div>}
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required
                    style={{ width: "100%", padding: "11px 14px 11px 40px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor="#6366f1"}
                    onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required
                    style={{ width: "100%", padding: "11px 14px 11px 40px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor="#6366f1"}
                    onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
              </div>
              <div style={{ marginBottom: 6 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required
                    style={{ width: "100%", padding: "11px 44px 11px 40px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor="#6366f1"}
                    onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                    {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              {formData.password && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Password strength:</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: strength.color }}>{strength.label}</span>
                  </div>
                  <div style={{ height: 4, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 4, transition: "width 0.3s" }} />
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required
                    style={{ width: "100%", padding: "11px 44px 11px 40px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor="#6366f1"}
                    onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                    {showConfirm ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
                {loading ? "Creating Account..." : "Register Now →"}
              </button>
            </form>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { name: "Google", svg: <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { name: "LinkedIn", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { name: "Microsoft", svg: <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M13 1h10v10H13z"/><path fill="#7FBA00" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg> },
              ].map((btn, i) => (
                <button key={i} style={{ padding: "10px 8px", border: "1.5px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#374151" }}>
                  {btn.svg} {btn.name}
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: "#64748b" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#6366f1", fontWeight: 700, textDecoration: "none" }}>Login now</Link>
            </div>
          </div>

        </div>

        {/* BOTTOM STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 40, paddingTop: 32, borderTop: "1px solid #e2e8f0" }}>
          {[
            { icon: "🔒", title: "100% Secure", desc: "Your data is protected" },
            { icon: "⚡", title: "Easy to Use", desc: "Setup in less than 2 minutes" },
            { icon: "🎧", title: "24/7 Support", desc: "We're here to help anytime" },
            { icon: "🇮🇳", title: "Made in India", desc: "For professionals across India" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: "#f1f5f9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
