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
    .select("business_name, full_name, designation, tagline, category, city, state, phone, logo_url, banner_url, display_as")
    .eq("username", username)
    .single();

  // Same personal/business priority the digital card itself uses
  const isPersonal = profile?.display_as === "personal";
  const bigName = profile
    ? (isPersonal ? (profile.full_name || profile.business_name) : (profile.business_name || profile.full_name))
    : "SmartProfile";
  const smallLine = profile
    ? (isPersonal ? profile.business_name : [profile.full_name, profile.designation].filter(Boolean).join(" · "))
    : "One Link. Complete Business.";
  const location = profile ? [profile.city, profile.state].filter(Boolean).join(", ") : "";
  const initial = (bigName || "?")[0]?.toUpperCase();

  // Long business names (e.g. "COPPERKING HOMEE INDIA PRIVATE LIMITED")
  // would overflow at a fixed large font size — so the name's font size
  // scales down as it gets longer, keeping everything on-card.
  const nameLen = (bigName || "").length;
  const nameFontSize = nameLen <= 18 ? 64 : nameLen <= 28 ? 50 : nameLen <= 40 ? 40 : 32;

  const BANNER_HEIGHT = 230;
  const LOGO_SIZE = 168;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Banner strip — this business's own banner image, matching how
            their actual Digital Card page looks. Falls back to a plain
            neutral gray (no brand-blue) when no banner has been uploaded. */}
        <div style={{ width: "100%", height: BANNER_HEIGHT, display: "flex", flexShrink: 0 }}>
          {profile?.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.banner_url} width={1200} height={BANNER_HEIGHT} style={{ objectFit: "cover" }} alt="" />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#e2e8f0" }} />
          )}
        </div>

        {/* Content — pulled up over the banner (negative margin) so the
            logo overlaps the banner's bottom edge, then centered text
            below, with the branding footer pinned to the bottom. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: -(LOGO_SIZE / 2),
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Logo circle, overlapping the banner */}
            <div
              style={{
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                borderRadius: "50%",
                background: profile?.logo_url ? "white" : "#334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "6px solid white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {profile?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.logo_url} width={LOGO_SIZE} height={LOGO_SIZE} style={{ objectFit: "cover" }} alt="" />
              ) : (
                <span style={{ fontSize: 72, fontWeight: 800, color: "white" }}>{initial}</span>
              )}
            </div>

            {/* Business/personal name — font size scales down for long names */}
            <div
              style={{
                fontSize: nameFontSize,
                fontWeight: 800,
                color: "#0f172a",
                textAlign: "center",
                lineHeight: 1.15,
                maxWidth: 1020,
                marginTop: 16,
              }}
            >
              {bigName}
            </div>

            {/* Subtitle line */}
            {smallLine && (
              <div style={{ fontSize: 28, fontWeight: 700, color: "#334155", marginTop: 10, textAlign: "center" }}>
                {smallLine}
              </div>
            )}

            {/* Location + phone row */}
            <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
              {location && (
                <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#475569", fontWeight: 600 }}>
                  📍 {location}
                </div>
              )}
              {profile?.phone && (
                <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#475569", fontWeight: 600 }}>
                  📞 +91 {profile.phone}
                </div>
              )}
            </div>
          </div>

          {/* Branding footer */}
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, marginBottom: 20 }}>
            <span style={{ fontWeight: 800, color: "#0f172a" }}>Smart</span>
            <span style={{ fontWeight: 800, color: "#475569" }}>Profile</span>
            <span style={{ marginLeft: 6, color: "#94a3b8", fontWeight: 400 }}>.in</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}