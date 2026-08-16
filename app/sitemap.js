import { supabase } from "@/lib/supabase";
import { slugifyCity, slugifyCategory, slugifyState } from "@/lib/slugify";

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

  // Only approved + active listings count toward the sitemap — matches the
  // same rule used by generateMetadata's robots tag on every directory
  // page, so the sitemap never advertises a URL that's set to noindex.
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, city, category, state")
    .eq("is_active", true)
    .eq("status", "approved");

  const directoryPages = (profiles || [])
    .filter((p) => p.city)
    .map((p) => ({
      url: `${baseUrl}/directory/${slugifyCity(p.city)}/${p.username}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  // City landing pages (smartprofile.in/directory/city) — one per distinct
  // city that has at least one active business. Cities with zero businesses
  // are noindexed on the page itself, so they're deliberately left out here.
  const citySlugs = [...new Set((profiles || []).filter((p) => p.city).map((p) => slugifyCity(p.city)))];
  const cityPages = citySlugs.map((slug) => ({
    url: `${baseUrl}/directory/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // State landing pages (smartprofile.in/directory/state/xyz) — one per
  // distinct state with active, approved businesses. States with zero
  // businesses are noindexed on the page itself, same reasoning as city
  // and category pages, so they're deliberately left out here.
  const stateSlugs = [...new Set((profiles || []).filter((p) => p.state).map((p) => slugifyState(p.state)))];
  const statePages = stateSlugs.map((slug) => ({
    url: `${baseUrl}/directory/state/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.65,
  }));

  // Category landing pages (smartprofile.in/directory/category/xyz) — same
  // reasoning as city pages: one per distinct category with active
  // businesses, empty ones stay noindexed on the page itself.
  const categorySlugs = [...new Set((profiles || []).filter((p) => p.category).map((p) => slugifyCategory(p.category)))];
  const categoryPages = categorySlugs.map((slug) => ({
    url: `${baseUrl}/directory/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // City + Category combo pages (smartprofile.in/directory/{city}/category/{category})
  // — the highest search-intent URL pattern (e.g. "electrician in Thane").
  // One per distinct city+category pair that has at least one active,
  // approved business; empty combos stay noindexed on the page itself.
  const comboKeys = [
    ...new Set(
      (profiles || [])
        .filter((p) => p.city && p.category)
        .map((p) => `${slugifyCity(p.city)}::${slugifyCategory(p.category)}`)
    ),
  ];
  const comboPages = comboKeys.map((key) => {
    const [citySlug, categorySlug] = key.split("::");
    return {
      url: `${baseUrl}/directory/${citySlug}/category/${categorySlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    };
  });

  return [...staticPages, ...cityPages, ...statePages, ...categoryPages, ...comboPages, ...directoryPages];
}