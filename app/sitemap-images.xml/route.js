import { createClient } from "@supabase/supabase-js";
import { slugifyCity } from "@/lib/slugify";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

function escapeXml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google Images sitemap (sitemap-image/1.1 extension). Only approved +
// active listings are included, matching the same indexing rule used for
// generateMetadata's robots tag — a pending listing's images shouldn't be
// offered to Google either. Runs entirely off live database data, so any
// image uploaded for any business (existing or future) shows up here
// automatically on next crawl, with no manual step per listing.
export async function GET() {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, city, category, business_name, full_name, banner_url, logo_url, directory_image_url, is_active, status")
    .eq("is_active", true)
    .eq("status", "approved");

  const { data: products } = await supabase
    .from("products")
    .select("profile_id, name, image_url");

  const { data: gallery } = await supabase
    .from("gallery")
    .select("profile_id, caption, image_url");

  const productsByProfile = {};
  (products || []).forEach((p) => {
    if (!p.image_url) return;
    (productsByProfile[p.profile_id] ||= []).push(p);
  });

  const galleryByProfile = {};
  (gallery || []).forEach((g) => {
    if (!g.image_url) return;
    (galleryByProfile[g.profile_id] ||= []).push(g);
  });

  const urlEntries = (profiles || [])
    .filter((p) => p.city)
    .map((p) => {
      const name = p.business_name || p.full_name || p.username;
      const citySlug = slugifyCity(p.city);
      const pageUrl = `https://www.smartprofile.in/directory/${citySlug}/${p.username}`;
      const locationBit = [p.category, p.city].filter(Boolean).join(" in ");
      const suffix = locationBit ? ` - ${locationBit}` : "";

      // Track URLs already added so the same image (e.g. directory_image_url
      // reused as the banner) never gets listed twice under different labels.
      const seenUrls = new Set();
      const images = [];
      const addImage = (url, title) => {
        if (!url || seenUrls.has(url)) return;
        seenUrls.add(url);
        images.push({ url, title });
      };

      addImage(p.banner_url, `${name} banner${suffix}`);
      addImage(p.logo_url, `${name} logo${suffix}`);
      // Directory listing thumbnail — a separate field from banner/logo,
      // shown on category/city grid cards (see ComboClient.jsx). Only
      // added if it's a genuinely different image from the two above.
      addImage(p.directory_image_url, `${name}${suffix}`);
      (productsByProfile[p.id] || []).forEach((prod) => {
        addImage(prod.image_url, `${prod.name || "Product"} - ${name}${suffix}`);
      });
      (galleryByProfile[p.id] || []).forEach((g) => {
        addImage(g.image_url, `${g.caption || "Photo"} - ${name}${suffix}`);
      });

      if (images.length === 0) return null;

      const imageTags = images
        .map(
          (img) => `    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
${imageTags}
  </url>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}