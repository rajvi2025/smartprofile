import { supabase } from "@/lib/supabase";

// Cache the rendered page for an hour instead of hitting Supabase on every
// single request — this is what was showing up in Ahrefs as pages taking
// 1.3s-24s to respond (cold Supabase round-trip on every crawl/visit).
export const revalidate = 3600;
import DirectoryClient from "./DirectoryClient";

function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

export const metadata = {
  title: "Business Directory | SmartProfile",
  description:
    "Search and discover verified businesses, professionals and services across India. Browse listings by city and category on SmartProfile Directory.",
  alternates: { canonical: "https://www.smartprofile.in/directory" },
  openGraph: {
    title: "SmartProfile Business Directory",
    description:
      "Search and discover verified businesses, professionals and services across India.",
    url: "https://www.smartprofile.in/directory",
    siteName: "SmartProfile Directory",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SmartProfile Business Directory",
    description:
      "Search and discover verified businesses, professionals and services across India.",
  },
};

// Keeps the JSON-LD payload reasonable as the directory grows — this is a
// discovery signal for Google, not the actual page content, so it doesn't
// need to list every single listing.
const MAX_ITEMLIST_ENTRIES = 100;

export default async function Page() {
  // Single query for everything this page needs — the JSON-LD itemList and
  // the actual business cards both derive from this. Previously this ran
  // two sequential Supabase round-trips, which is what Ahrefs was flagging
  // as a ~2.1s slow page.
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true);

  const itemListElements = (allProfiles || [])
    .filter((p) => p.city)
    .slice(0, MAX_ITEMLIST_ENTRIES)
    .map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.smartprofile.in/directory/${slugifyCity(p.city)}/${p.username}`,
      name: p.business_name || p.full_name || p.username,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://www.smartprofile.in/directory#collection",
        name: "SmartProfile Business Directory",
        description:
          "Search and discover verified businesses, professionals and services across India.",
        url: "https://www.smartprofile.in/directory",
      },
      // Lightweight references only (url + name) — each listing's own page
      // carries its full LocalBusiness/AggregateRating schema. Google
      // doesn't allow an AggregateRating on a collection/list page anyway,
      // so this list intentionally doesn't nest ratings.
      ...(itemListElements.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": "https://www.smartprofile.in/directory#itemlist",
              itemListElement: itemListElements,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DirectoryClient initialProfiles={allProfiles || []} />
    </>
  );
}