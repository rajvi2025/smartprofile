function MobileHero() {
  return (
    <section style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 40%, #dbeafe 100%)", padding: "28px 20px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -60, top: 40, width: 320, height: 320, background: "radial-gradient(circle, #3b82f6, #6366f1)", borderRadius: "50%", opacity: 0.2 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, color: "#475569", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
          Create. Share. Connect.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, marginBottom: 10, color: "#0f172a" }}>
              Your Identity.<br />Your<br />
              <span style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart Profile.</span>
            </h1>
            <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 14 }}>Create a beautiful digital profile, share anywhere, grow connections.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
              {["Digital Business Card", "QR Code & NFC", "Analytics & Leads", "Business Directory"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 600, color: "#334155" }}>
                  <div style={{ width: 16, height: 16, background: "linear-gradient(135deg, #3b82f6, #6366f1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a href="/dashboard/create-profile" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", padding: "11px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: "none", textAlign: "center", boxShadow: "0 4px 14px rgba(59,130,246,0.4)" }}>Create Your Profile →</a>
              <a href="/rajesh-sharma" style={{ background: "#fff", color: "#334155", padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none", textAlign: "center", border: "1px solid #e2e8f0" }}>View Demo →</a>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", right: -8, top: 0, background: "#fff", borderRadius: 10, padding: "8px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 10 }}>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>Profile Views</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>1,250+</div>
              <div style={{ fontSize: 9, color: "#22c55e", fontWeight: 600 }}>↑ +18% this week</div>
            </div>
            <div style={{ position: "absolute", right: -8, bottom: 20, background: "#fff", borderRadius: 10, padding: "8px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 10 }}>
              <div style={{ fontSize: 9, color: "#94a3b8" }}>Leads Captured</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>320+</div>
              <div style={{ fontSize: 9, color: "#22c55e", fontWeight: 600 }}>↑ +24% this week</div>
            </div>
            <div style={{ width: 130, height: 260, background: "#0a0f1e", borderRadius: 24, padding: "8px", boxShadow: "0 16px 48px rgba(0,0,0,0.35)", margin: "24px auto 0" }}>
              <div style={{ background: "linear-gradient(160deg, #1e40af 0%, #312e81 50%, #1e1b4b 100%)", borderRadius: 18, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px 10px", overflow: "hidden" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", marginBottom: 6, border: "2px solid rgba(255,255,255,0.25)" }}>RS</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 9, marginBottom: 1 }}>Rajesh Sharma</div>
                <div style={{ color: "#cbd5e1", fontSize: 7, marginBottom: 1 }}>Real Estate Agent</div>
                <div style={{ color: "#94a3b8", fontSize: 7, marginBottom: 8 }}>📍 Pune, Maharashtra</div>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                  {[["#E4405F","ig"],["#0A66C2","in"],["#1DA1F2","tw"],["#FF0000","yt"]].map(([c,s],i) => (
                    <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, color: "#fff", fontWeight: 700 }}>{s}</div>
                  ))}
                </div>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    <div style={{ flex: 1, background: "#3b82f6", borderRadius: 5, padding: "4px", textAlign: "center", color: "#fff", fontSize: 7, fontWeight: 600 }}>Call</div>
                    <div style={{ flex: 1, background: "#25d366", borderRadius: 5, padding: "4px", textAlign: "center", color: "#fff", fontSize: 7, fontWeight: 600 }}>WhatsApp</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 5, padding: "4px", textAlign: "center", color: "#fff", fontSize: 7, fontWeight: 700 }}>Save Contact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
