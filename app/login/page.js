"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); }
    else { window.location.href = "/dashboard"; }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #eff6ff 100%)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", width: "100%" }}>

        {/* LEFT */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#3b82f6", marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            All-in-One Digital Identity
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", lineHeight: 1.2, marginBottom: 16 }}>Manage Your Identity.<br />Grow Your Network.</h1>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 36 }}>SmartProfile helps you create, manage and share your digital identity with powerful tools.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 36 }}>
            {[
              { icon: "🛡️", bg: "#eef2ff", title: "Secure & Private", desc: "Your data is encrypted and always protected with us." },
              { icon: "⚡", bg: "#ecfdf5", title: "Quick Access", desc: "Access your dashboard and tools in just a few seconds." },
              { icon: "📊", bg: "#fffbeb", title: "Track & Manage", desc: "Track your profile, cards and connections seamlessly." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 42, height: 42, background: item.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ width: 38, height: 38, background: "#eff6ff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>Trusted by 10,000+ Professionals</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Join the SmartProfile community today.</div>
            </div>
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 36px", boxShadow: "0 20px 60px rgba(99,102,241,0.1)", border: "1px solid #e2e8f0" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Image src="/logo-icon.png" alt="SmartProfile" width={56} height={56} priority />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Welcome Back! 👋</h2>
            <p style={{ fontSize: 13, color: "#64748b" }}>Login to your SmartProfile account</p>
          </div>
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "11px 14px", color: "#dc2626", fontSize: 13, marginBottom: 18 }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                  style={{ width: "100%", padding: "11px 14px 11px 40px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor="#6366f1"}
                  onBlur={e => e.target.style.borderColor="#e2e8f0"} />
              </div>
            </div>
            <div style={{ marginBottom: 6 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required
                  style={{ width: "100%", padding: "11px 44px 11px 40px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor="#6366f1"}
                  onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showPassword
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right", marginBottom: 6 }}><Link href="/forgot-password" style={{ fontSize: 12, color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>Forgot Password?</Link></div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20, marginTop: 14 }}>
              <input type="checkbox" id="remember" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#6366f1", cursor: "pointer" }} />
              <label htmlFor="remember" style={{ fontSize: 13, color: "#374151", cursor: "pointer" }}>Remember me</label>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
              {loading ? "Logging in..." : "Login →"}
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
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#6366f1", fontWeight: 700, textDecoration: "none" }}>Register now</Link>
          </div>
        </div>

      </div>
    </div>
  );
}