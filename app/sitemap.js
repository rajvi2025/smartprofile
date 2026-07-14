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
  ];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, city")
    .eq("is_active", true);

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