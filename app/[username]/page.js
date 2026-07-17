import { createClient } from "@supabase/supabase-js";
import ProfileClient from "./ProfileClient";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

// Runs on the server before the page is sent, so WhatsApp/Facebook/etc. link
// previews show this business's own name, tagline and photo — instead of
// the generic site-wide SmartProfile card that showed for every link before.
export async function generateMetadata({ params }) {
  const { username } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, full_name, tagline, about, directory_image_url, banner_url, logo_url, city")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "SmartProfile.in — One Link. Complete Business.",
      description: "Create your Digital Business Card with SmartProfile.",
      robots: { index: false, follow: false },
    };
  }

  const name = profile.business_name || profile.full_name || username;

  return {
    // Kept for the browser tab / accessibility only — this does not show
    // up in the WhatsApp/social preview card below the image.
    title: `${name} | SmartProfile`,
    // Digital Card URLs (smartprofile.in/username) are for NFC/QR/personal
    // sharing only. They must never be indexed by Google — the richer
    // Directory Listing page (smartprofile.in/directory/city/username) is
    // the canonical, SEO-facing version of this same business, and having
    // both indexed would look like duplicate content to Google.
    robots: { index: false, follow: false },
    ...(profile.city ? { alternates: { canonical: `https://smartprofile.in/directory/${slugifyCity(profile.city)}/${username}` } } : {}),
    // No title/description here on purpose — the OG image itself already
    // carries the business name, tagline, etc., so the text card below it
    // in WhatsApp/social previews is left blank rather than duplicating
    // the same info as plain text.
    openGraph: {
      url: `https://smartprofile.in/${username}`,
      siteName: "SmartProfile.in",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function Page({ params }) {
  const { username } = await params;
  return <ProfileClient username={username} />;
}