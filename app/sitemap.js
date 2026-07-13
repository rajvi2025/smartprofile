import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl = "https://smartprofile.in";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, city")
    .eq("is_active", true);

  // Directory Listing pages (smartprofile.in/directory/city/username) are
  // the SEO-facing, indexable version of each business — Digital Card URLs
  // (smartprofile.in/username) are noindex on purpose and must NOT appear
  // here, or Google sees the same business twice as duplicate content.
  const slugifyCity = (city) => (city || "").toLowerCase().trim().replace(/\s+/g, "-");
  const directoryPages = (profiles || [])
    .filter((p) => p.city)
    .map((p) => ({
      url: `${baseUrl}/directory/${slugifyCity(p.city)}/${p.username}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticPages, ...directoryPages];
}