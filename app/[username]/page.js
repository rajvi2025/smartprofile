import { createClient } from "@supabase/supabase-js";
import ProfileClient from "./ProfileClient";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// Runs on the server before the page is sent, so WhatsApp/Facebook/etc. link
// previews show this business's own name, tagline and photo — instead of
// the generic site-wide SmartProfile card that showed for every link before.
export async function generateMetadata({ params }) {
  const { username } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, full_name, tagline, about, directory_image_url, banner_url, logo_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "SmartProfile.in — One Link. Complete Business.",
      description: "Create your Digital Business Card with SmartProfile.",
    };
  }

  const name = profile.business_name || profile.full_name || username;
  const description =
    profile.tagline ||
    (profile.about ? profile.about.slice(0, 150) : "View my Digital Business Card on SmartProfile.");
  const image = profile.directory_image_url || profile.banner_url || profile.logo_url;

  return {
    title: `${name} | SmartProfile`,
    description,
    openGraph: {
      title: name,
      description,
      url: `https://smartprofile.in/${username}`,
      siteName: "SmartProfile.in",
      images: image ? [{ url: image, width: 800, height: 600, alt: name }] : undefined,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const { username } = await params;
  return <ProfileClient username={username} />;
}