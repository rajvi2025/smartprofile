import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "Digital Business Card";
export const size = { width: 630, height: 1200 };
export const contentType = "image/png";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// --- SVG icons (emojis don't render reliably inside next/og image generation) ---
function PinIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
      <path d="M12 22s7-7.05 7-12a7 7 0 10-14 0c0 4.95 7 12 7 12z" fill="#64748b" />
      <circle cx="12" cy="10" r="2.5" fill="white" />
    </svg>
  );
}

function PhoneIconSmall() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="#64748b" style={{ marginRight: 8 }}>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1v3.5a1 1 0 01-1 1A18 18 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="white">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1v3.5a1 1 0 01-1 1A18 18 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
      <path d="M12 2a10 10 0 00-8.94 14.5L2 22l5.5-1.06A10 10 0 1012 2zm0 18a8 8 0 01-4.06-1.11l-.29-.17-3 .58.58-2.94-.19-.3A8 8 0 1112 20zm4.5-5.66c-.24-.12-1.43-.7-1.65-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 01-3.24-2.83c-.24-.42.24-.39.7-1.29a.44.44 0 000-.42c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.4h-.46a.9.9 0 00-.65.3 2.7 2.7 0 00-.84 2 4.7 4.7 0 001 2.5 10.8 10.8 0 004.14 3.66c1.45.63 2.02.68 2.75.57a2.35 2.35 0 001.55-1.1 1.94 1.94 0 00.14-1.1c-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <circle cx="12" cy="8" r="4" fill="white" stroke="none" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8.46 15.46a5 5 0 017.08 0l-1.42 1.42a3 3 0 00-4.24 0zM5.64 12.64a9 9 0 0112.72 0l-1.42 1.42a7 7 0 00-9.88 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

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

  // Keep only the last 10 digits — safe regardless of whether the DB value
  // has a "+91"/"91" prefix or not, and never wrongly trims a real number
  // that happens to start with 91.
  const phoneDigits = profile?.phone ? profile.phone.replace(/\D/g, "") : "";
  const cleanPhone = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits;

  const nameLen = (bigName || "").length;
  const nameFontSize = nameLen <= 18 ? 57 : nameLen <= 28 ? 44 : nameLen <= 40 ? 31 : 25;
  const subtitleMarginTop = nameLen > 28 ? 64 : 13;

  // Phone width fills the canvas with a 9px margin each side. Top margin
  // is set a bit larger than the sides so the phone's top bezel edge reads
  // clearly. Height is deliberately taller than the canvas: the extra
  // height at the bottom simply runs off the edge of the fixed-size canvas
  // and gets cropped there — no rounded bottom corner ever renders, no
  // bottom margin, and the visible portion works out to ~85% of the phone.
  const PHONE_W = 612;
  const TOP_MARGIN = 26;
  const VISIBLE_H = 1200 - TOP_MARGIN; // canvas height minus the top margin
  const PHONE_H = Math.round(VISIBLE_H / 0.85); // 85% of this is visible
  const BANNER_HEIGHT = 264;
  const LOGO_SIZE = 195;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: TOP_MARGIN,
          fontFamily: "sans-serif",
        }}
      >
        {/* Phone bezel — extra height added only at the bottom (as a plain
            black chin), so it's the part that runs off-canvas and crops
            away, while the screen content above stays exactly where it
            was and stays fully visible. */}
        <div
          style={{
            width: PHONE_W,
            height: PHONE_H,
            display: "flex",
            background: "#111318",
            paddingTop: 18,
            paddingLeft: 18,
            paddingRight: 18,
            paddingBottom: PHONE_H - 18 - 984,
            borderRadius: 60,
            position: "relative",
            boxShadow: "0 30px 70px rgba(15,23,42,0.4)",
          }}
        >
          {/* Screen */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 44,
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
                paddingBottom: 18,
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
                    border: "7px solid white",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    overflow: "hidden",
                  }}
                >
                  {profile?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.logo_url} width={LOGO_SIZE} height={LOGO_SIZE} style={{ objectFit: "cover" }} alt="" />
                  ) : (
                    <span style={{ fontSize: 73, fontWeight: 800, color: "white" }}>{initial}</span>
                  )}
                </div>
                {profile?.is_verified && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 3,
                      right: 3,
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "#2563eb",
                      border: "5px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon />
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
                  maxWidth: 540,
                  marginTop: 18,
                }}
              >
                {bigName}
              </div>

              {smallLine && (
                <div style={{ fontSize: 26, fontWeight: 700, color: "#334155", marginTop: subtitleMarginTop, textAlign: "center" }}>
                  {smallLine}
                </div>
              )}

              {location && (
                <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: "#64748b", fontWeight: 600, marginTop: 16 }}>
                  <PinIcon />
                  {location}
                </div>
              )}

              {profile?.category && (
                <div
                  style={{
                    display: "flex",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#475569",
                    background: "#f1f5f9",
                    padding: "8px 23px",
                    borderRadius: 999,
                    marginTop: 19,
                  }}
                >
                  {profile.category}
                </div>
              )}

              {/* Action buttons — mirrors Call / WhatsApp / Save on the
                  actual Digital Card. */}
              <div style={{ display: "flex", gap: 21, marginTop: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 78, height: 78, borderRadius: 22, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CallIcon />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#475569" }}>Call</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 78, height: 78, borderRadius: 22, background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WhatsAppIcon />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#475569" }}>WhatsApp</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 78, height: 78, borderRadius: 22, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SaveIcon />
                  </div>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#475569" }}>Save</span>
                </div>
              </div>

              {cleanPhone && (
                <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: "#64748b", fontWeight: 600, marginTop: 29 }}>
                  <PhoneIconSmall />
                  +91 {cleanPhone}
                </div>
              )}

              {/* Branding footer, pinned to the bottom of the screen */}
              <div style={{ display: "flex", alignItems: "center", fontSize: 22, marginTop: "auto", marginBottom: 5 }}>
                <span style={{ fontWeight: 800, color: "#0f172a" }}>Smart</span>
                <span style={{ fontWeight: 800, color: "#475569" }}>Profile</span>
                <span style={{ marginLeft: 7, color: "#94a3b8", fontWeight: 400 }}>.in</span>
              </div>
            </div>
          </div>

          {/* Status bar — rendered LAST so it paints on top of the banner. */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 57,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 39px",
            }}
          >
            <span style={{ fontSize: 21, fontWeight: 700, color: "white" }}>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
                {[6, 9, 12, 15].map((h) => (
                  <div key={h} style={{ width: 4, height: h * 1.3, background: "white", borderRadius: 1 }} />
                ))}
              </div>
              <WifiIcon />
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 33, height: 16, border: "2px solid white", borderRadius: 4, display: "flex", padding: 2 }}>
                  <div style={{ flex: 1, height: "100%", background: "white", borderRadius: 1 }} />
                </div>
                <div style={{ width: 3, height: 7, background: "white", marginLeft: 1, borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 13,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 169, height: 34, background: "#111318", borderRadius: 20, display: "flex" }} />
          </div>

          {/* Physical side buttons */}
          <div style={{ position: "absolute", left: -4, top: 141, width: 5, height: 29, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
          <div style={{ position: "absolute", left: -4, top: 193, width: 5, height: 68, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
          <div style={{ position: "absolute", left: -4, top: 273, width: 5, height: 68, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
          <div style={{ position: "absolute", right: -4, top: 221, width: 5, height: 96, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}