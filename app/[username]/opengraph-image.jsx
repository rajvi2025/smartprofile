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
    .select("business_name, full_name, designation, tagline, category, city, state, phone, logo_url, display_as")
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
  // would overflow and collide with the subtitle/tagline below at a fixed
  // large font size — so the name's font size scales down as it gets
  // longer, keeping everything on-card no matter how long the name is.
  const nameLen = (bigName || "").length;
  const nameFontSize = nameLen <= 18 ? 76 : nameLen <= 28 ? 58 : nameLen <= 40 ? 44 : 34;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 45%, #3b82f6 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Card panel — sized close to the full canvas so it still reads
            clearly at WhatsApp/social media's small thumbnail size, not
            just at full resolution. Height is intrinsic (not fixed) so it
            never clips or overlaps content when the name wraps to 2 lines. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            borderRadius: 36,
            padding: "44px 60px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            width: 1120,
          }}
        >
          {/* Logo circle — bigger, so it's still recognizable when scaled
              down to a tiny thumbnail. */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: profile?.logo_url ? "white" : "#1e40af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "8px solid #dbeafe",
              overflow: "hidden",
              marginBottom: 22,
              flexShrink: 0,
            }}
          >
            {profile?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.logo_url} width={180} height={180} style={{ objectFit: "cover" }} alt="" />
            ) : (
              <span style={{ fontSize: 80, fontWeight: 800, color: "white" }}>{initial}</span>
            )}
          </div>

          {/* Business/personal name — font size scales down automatically
              for longer names so it never overflows the card. */}
          <div
            style={{
              fontSize: nameFontSize,
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {bigName}
          </div>

          {/* Subtitle line */}
          {smallLine && (
            <div style={{ fontSize: 32, fontWeight: 700, color: "#3b82f6", marginTop: 12, textAlign: "center" }}>
              {smallLine}
            </div>
          )}

          {/* Location + phone row */}
          <div style={{ display: "flex", gap: 32, marginTop: 22 }}>
            {location && (
              <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#475569", fontWeight: 600 }}>
                📍 {location}
              </div>
            )}
            {profile?.phone && (
              <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#475569", fontWeight: 600 }}>
                📞 +91 {profile.phone}
              </div>
            )}
          </div>
        </div>

        {/* Branding footer */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 22, fontSize: 26, color: "white" }}>
          <span style={{ fontWeight: 800 }}>Smart</span>
          <span style={{ fontWeight: 800, color: "#bfdbfe" }}>Profile</span>
          <span style={{ marginLeft: 8, color: "#dbeafe", fontWeight: 400 }}>.in</span>
        </div>
      </div>
    ),
    { ...size }
  );
}