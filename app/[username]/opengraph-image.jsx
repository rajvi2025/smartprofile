import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "Digital Business Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

export default async function Image({ params }) {
  const { username } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, full_name, designation, tagline, category, city, state, phone, logo_url, banner_url, display_as, is_verified")
    .eq("username", username)
    .single();

  const isPersonal = profile?.display_as === "personal";
  const bigName = profile
    ? (isPersonal ? (profile.full_name || profile.business_name) : (profile.business_name || profile.full_name))
    : "SmartProfile";
  const smallLine = profile
    ? (isPersonal ? profile.business_name : [profile.full_name, profile.designation].filter(Boolean).join(" · "))
    : "One Link. Complete Business.";
  const location = profile ? [profile.city, profile.state].filter(Boolean).join(", ") : "";
  const initial = (bigName || "?")[0]?.toUpperCase();

  // Long business names would overflow at a fixed font size, so it scales
  // down automatically as the name gets longer.
  const nameLen = (bigName || "").length;
  const nameFontSize = nameLen <= 18 ? 44 : nameLen <= 28 ? 34 : nameLen <= 40 ? 24 : 19;
  // Names past ~28 characters usually wrap to 2 lines on the phone's width
  // — give the subtitle extra clearance in that case so it never collides
  // with the wrapped second line.
  const subtitleMarginTop = nameLen > 28 ? 40 : 8;

  // Real phone proportions (portrait, not stretched to landscape) — but the
  // canvas AROUND it is transparent, not a colored fill. So instead of a
  // wide stretched rectangle (previous attempt) or a visible gray box
  // (before that), what actually renders is just the phone shape itself —
  // WhatsApp/browsers show whatever's behind a transparent PNG (usually
  // white), so there's no visible "extra background" at all.
  const PHONE_W = 476;
  const PHONE_H = 626;
  const BANNER_HEIGHT = 206;
  const LOGO_SIZE = 152;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Phone bezel — real portrait phone proportions */}
        <div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            display: "flex",
            background: "#111318",
            padding: 14,
            borderRadius: 46,
            position: "relative",
            boxShadow: "0 30px 70px rgba(15,23,42,0.4)",
          }}
        >
          {/* Screen — fills the bezel completely */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 34,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Banner */}
            <div style={{ width: "100%", height: BANNER_HEIGHT, display: "flex", flexShrink: 0 }}>
              {profile?.banner_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.banner_url} width={PHONE_W} height={BANNER_HEIGHT} style={{ objectFit: "cover" }} alt="" />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#dde3ea" }} />
              )}
            </div>

            {/* Content, pulled up over the banner so the logo overlaps it */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: -(LOGO_SIZE / 2),
                paddingBottom: 14,
              }}
            >
              {/* Logo circle with optional verified badge */}
              <div style={{ display: "flex", position: "relative" }}>
                <div
                  style={{
                    width: LOGO_SIZE,
                    height: LOGO_SIZE,
                    borderRadius: "50%",
                    background: profile?.logo_url ? "white" : "#334155",
                    display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "5px solid white",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                  overflow: "hidden",
                }}
              >
                {profile?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.logo_url} width={LOGO_SIZE} height={LOGO_SIZE} style={{ objectFit: "cover" }} alt="" />
                ) : (
                  <span style={{ fontSize: 56, fontWeight: 800, color: "white" }}>{initial}</span>
                )}
              </div>
              {profile?.is_verified && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#2563eb",
                    border: "4px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontSize: 15, fontWeight: 900 }}>✓</span>
                </div>
              )}
            </div>

            {/* Name — scales down for long names */}
            <div
              style={{
                fontSize: nameFontSize,
                fontWeight: 800,
                color: "#0f172a",
                textAlign: "center",
                lineHeight: 1.15,
                maxWidth: 1000,
                marginTop: 14,
              }}
            >
              {bigName}
            </div>

            {smallLine && (
              <div style={{ fontSize: 20, fontWeight: 700, color: "#334155", marginTop: subtitleMarginTop, textAlign: "center" }}>
                {smallLine}
              </div>
            )}

            {location && (
              <div style={{ display: "flex", alignItems: "center", fontSize: 17, color: "#64748b", fontWeight: 600, marginTop: 10 }}>
                📍 {location}
              </div>
            )}

            {profile?.category && (
              <div
                style={{
                  display: "flex",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#475569",
                  background: "#f1f5f9",
                  padding: "6px 18px",
                  borderRadius: 999,
                  marginTop: 12,
                }}
              >
                {profile.category}
              </div>
            )}

            {/* Action buttons — mirrors the real Call / WhatsApp / Save
                buttons on the actual Digital Card. */}
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 60, height: 60, borderRadius: 17, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📞</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Call</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 60, height: 60, borderRadius: 17, background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>💬</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>WhatsApp</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 60, height: 60, borderRadius: 17, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>👤</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Save</span>
              </div>
            </div>

            {profile?.phone && (
              <div style={{ display: "flex", alignItems: "center", fontSize: 17, color: "#64748b", fontWeight: 600, marginTop: 18 }}>
                📞 +91 {profile.phone}
              </div>
            )}

            {/* Branding footer, pinned to the bottom of the screen */}
            <div style={{ display: "flex", alignItems: "center", fontSize: 17, marginTop: "auto", marginBottom: 4 }}>
              <span style={{ fontWeight: 800, color: "#0f172a" }}>Smart</span>
              <span style={{ fontWeight: 800, color: "#475569" }}>Profile</span>
              <span style={{ marginLeft: 5, color: "#94a3b8", fontWeight: 400 }}>.in</span>
            </div>
          </div>

          {/* Status bar — rendered LAST so it paints on top of the banner. */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 30px",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "white" }}>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                {[6, 9, 12, 15].map((h) => (
                  <div key={h} style={{ width: 3, height: h, background: "white", borderRadius: 1 }} />
                ))}
              </div>
              <span style={{ fontSize: 15, color: "white" }}>📶</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 25, height: 12, border: "1.5px solid white", borderRadius: 3, display: "flex", padding: 2 }}>
                  <div style={{ flex: 1, height: "100%", background: "white", borderRadius: 1 }} />
                </div>
                <div style={{ width: 2, height: 5, background: "white", marginLeft: 1, borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 130, height: 26, background: "#111318", borderRadius: 15, display: "flex" }} />
          </div>
        </div>
      </div>
      </div>
    ),
    { ...size }
  );
}