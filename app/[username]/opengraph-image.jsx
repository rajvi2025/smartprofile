import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "Digital Business Card";
// Portrait canvas instead of the standard 1200x630 landscape. A tall,
// narrow phone mockup inside a wide landscape box always leaves big empty
// strips on the left/right — no way around that geometry. Switching the
// canvas itself to a portrait shape (close to the phone's own proportions)
// means the phone can fill almost the full width with only a small margin.
export const size = { width: 750, height: 970 };
export const contentType = "image/png";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// --- SVG icons (emojis don't render reliably inside next/og image generation) ---
function PinIcon({ s }) {
  return (
    <svg width={16 * s} height={16 * s} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 * s }}>
      <path d="M12 22s7-7.05 7-12a7 7 0 10-14 0c0 4.95 7 12 7 12z" fill="#64748b" />
      <circle cx="12" cy="10" r="2.5" fill="white" />
    </svg>
  );
}

function PhoneIconSmall({ s }) {
  return (
    <svg width={16 * s} height={16 * s} viewBox="0 0 24 24" fill="#64748b" style={{ marginRight: 6 * s }}>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1v3.5a1 1 0 01-1 1A18 18 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function CallIcon({ s }) {
  return (
    <svg width={26 * s} height={26 * s} viewBox="0 0 24 24" fill="white">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1v3.5a1 1 0 01-1 1A18 18 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function WhatsAppIcon({ s }) {
  return (
    <svg width={28 * s} height={28 * s} viewBox="0 0 24 24" fill="white">
      <path d="M12 2a10 10 0 00-8.94 14.5L2 22l5.5-1.06A10 10 0 1012 2zm0 18a8 8 0 01-4.06-1.11l-.29-.17-3 .58.58-2.94-.19-.3A8 8 0 1112 20zm4.5-5.66c-.24-.12-1.43-.7-1.65-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.5 6.5 0 01-3.24-2.83c-.24-.42.24-.39.7-1.29a.44.44 0 000-.42c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.4h-.46a.9.9 0 00-.65.3 2.7 2.7 0 00-.84 2 4.7 4.7 0 001 2.5 10.8 10.8 0 004.14 3.66c1.45.63 2.02.68 2.75.57a2.35 2.35 0 001.55-1.1 1.94 1.94 0 00.14-1.1c-.06-.1-.22-.16-.46-.28z" />
    </svg>
  );
}

function SaveIcon({ s }) {
  return (
    <svg width={26 * s} height={26 * s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <circle cx="12" cy="8" r="4" fill="white" stroke="none" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function WifiIcon({ s }) {
  return (
    <svg width={16 * s} height={16 * s} viewBox="0 0 24 24" fill="white">
      <path d="M12 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM8.46 15.46a5 5 0 017.08 0l-1.42 1.42a3 3 0 00-4.24 0zM5.64 12.64a9 9 0 0112.72 0l-1.42 1.42a7 7 0 00-9.88 0z" />
    </svg>
  );
}

function CheckIcon({ s }) {
  return (
    <svg width={16 * s} height={16 * s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

  // Phone may be saved with or without a "+91"/"91" country-code prefix.
  // Instead of blindly stripping a leading "91" (which would wrongly cut a
  // legitimate 10-digit number that happens to start with 91), just keep
  // the last 10 digits — that's always the actual mobile number.
  const phoneDigits = profile?.phone ? profile.phone.replace(/\D/g, "") : "";
  const cleanPhone = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits;

  // SCALE drives every size below off the original 468-wide design, so the
  // whole mockup grows/shrinks together without re-tuning each number by
  // hand. Bump this one value to resize everything proportionally.
  const S = 1.5;

  // Long business names would overflow at a fixed font size, so it scales
  // down automatically as the name gets longer.
  const nameLen = (bigName || "").length;
  const nameFontSize = (nameLen <= 18 ? 44 : nameLen <= 28 ? 34 : nameLen <= 40 ? 24 : 19) * S;
  // Names past ~28 characters usually wrap to 2 lines on the phone's width
  // — give the subtitle extra clearance in that case so it never collides
  // with the wrapped second line.
  const subtitleMarginTop = (nameLen > 28 ? 40 : 8) * S;

  // Real phone proportions (portrait, not stretched to landscape), scaled
  // up to fill the new portrait canvas edge-to-edge with only a small,
  // deliberate margin.
  const PHONE_W = 468 * S;
  const PHONE_H = 616 * S;
  const BANNER_HEIGHT = 203 * S;
  const LOGO_SIZE = 150 * S;

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
            padding: 14 * S,
            borderRadius: 46 * S,
            position: "relative",
            boxShadow: "0 30px 70px rgba(15,23,42,0.4)",
          }}
        >
          {/* Screen — fills the bezel completely */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 34 * S,
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
                paddingBottom: 14 * S,
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
                    border: `${5 * S}px solid white`,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    overflow: "hidden",
                  }}
                >
                  {profile?.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.logo_url} width={LOGO_SIZE} height={LOGO_SIZE} style={{ objectFit: "cover" }} alt="" />
                  ) : (
                    <span style={{ fontSize: 56 * S, fontWeight: 800, color: "white" }}>{initial}</span>
                  )}
                </div>
                {profile?.is_verified && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2 * S,
                      right: 2 * S,
                      width: 32 * S,
                      height: 32 * S,
                      borderRadius: "50%",
                      background: "#2563eb",
                      border: `${4 * S}px solid white`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon s={S} />
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
                  marginTop: 14 * S,
                }}
              >
                {bigName}
              </div>

              {smallLine && (
                <div style={{ fontSize: 20 * S, fontWeight: 700, color: "#334155", marginTop: subtitleMarginTop, textAlign: "center" }}>
                  {smallLine}
                </div>
              )}

              {location && (
                <div style={{ display: "flex", alignItems: "center", fontSize: 17 * S, color: "#64748b", fontWeight: 600, marginTop: 10 * S }}>
                  <PinIcon s={S} />
                  {location}
                </div>
              )}

              {profile?.category && (
                <div
                  style={{
                    display: "flex",
                    fontSize: 15 * S,
                    fontWeight: 700,
                    color: "#475569",
                    background: "#f1f5f9",
                    padding: `${6 * S}px ${18 * S}px`,
                    borderRadius: 999,
                    marginTop: 12 * S,
                  }}
                >
                  {profile.category}
                </div>
              )}

              {/* Action buttons — mirrors the real Call / WhatsApp / Save
                  buttons on the actual Digital Card. */}
              <div style={{ display: "flex", gap: 16 * S, marginTop: 20 * S }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 * S }}>
                  <div style={{ width: 60 * S, height: 60 * S, borderRadius: 17 * S, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CallIcon s={S} />
                  </div>
                  <span style={{ fontSize: 13 * S, fontWeight: 700, color: "#475569" }}>Call</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 * S }}>
                  <div style={{ width: 60 * S, height: 60 * S, borderRadius: 17 * S, background: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WhatsAppIcon s={S} />
                  </div>
                  <span style={{ fontSize: 13 * S, fontWeight: 700, color: "#475569" }}>WhatsApp</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 * S }}>
                  <div style={{ width: 60 * S, height: 60 * S, borderRadius: 17 * S, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <SaveIcon s={S} />
                  </div>
                  <span style={{ fontSize: 13 * S, fontWeight: 700, color: "#475569" }}>Save</span>
                </div>
              </div>

              {cleanPhone && (
                <div style={{ display: "flex", alignItems: "center", fontSize: 17 * S, color: "#64748b", fontWeight: 600, marginTop: 18 * S }}>
                  <PhoneIconSmall s={S} />
                  +91 {cleanPhone}
                </div>
              )}

              {/* Branding footer, pinned to the bottom of the screen */}
              <div style={{ display: "flex", alignItems: "center", fontSize: 17 * S, marginTop: "auto", marginBottom: 4 * S }}>
                <span style={{ fontWeight: 800, color: "#0f172a" }}>Smart</span>
                <span style={{ fontWeight: 800, color: "#475569" }}>Profile</span>
                <span style={{ marginLeft: 5 * S, color: "#94a3b8", fontWeight: 400 }}>.in</span>
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
              height: 44 * S,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: `0 ${30 * S}px`,
            }}
          >
            <span style={{ fontSize: 16 * S, fontWeight: 700, color: "white" }}>9:41</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 * S }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2 * S }}>
                {[6, 9, 12, 15].map((h) => (
                  <div key={h} style={{ width: 3 * S, height: h * S, background: "white", borderRadius: 1 }} />
                ))}
              </div>
              <WifiIcon s={S} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 25 * S, height: 12 * S, border: "1.5px solid white", borderRadius: 3, display: "flex", padding: 2 }}>
                  <div style={{ flex: 1, height: "100%", background: "white", borderRadius: 1 }} />
                </div>
                <div style={{ width: 2 * S, height: 5 * S, background: "white", marginLeft: 1, borderRadius: 1 }} />
              </div>
            </div>
          </div>

          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 10 * S,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 130 * S, height: 26 * S, background: "#111318", borderRadius: 15 * S, display: "flex" }} />
          </div>

          {/* Physical side buttons — real iPhones have these, without them the
              mockup reads as a flat rounded rectangle instead of a phone. */}
          {/* Mute switch (left) */}
          <div style={{ position: "absolute", left: -3 * S, top: 108 * S, width: 4 * S, height: 22 * S, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
          {/* Volume up (left) */}
          <div style={{ position: "absolute", left: -3 * S, top: 148 * S, width: 4 * S, height: 52 * S, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
          {/* Volume down (left) */}
          <div style={{ position: "absolute", left: -3 * S, top: 210 * S, width: 4 * S, height: 52 * S, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
          {/* Power button (right) */}
          <div style={{ position: "absolute", right: -3 * S, top: 170 * S, width: 4 * S, height: 74 * S, background: "#2a2d35", borderRadius: 2, display: "flex" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}