import { supabase } from "@/lib/supabase";
import DirectoryClient from "./DirectoryClient";

function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

export const metadata = {
  title: "Business Directory - Find Verified Businesses Across India | SmartProfile",
  description:
    "Search and discover verified businesses, professionals and services across India. Browse listings by city and category on SmartProfile Directory.",
  alternates: { canonical: "https://smartprofile.in/directory" },
  openGraph: {
    title: "SmartProfile Business Directory",
    description:
      "Search and discover verified businesses, professionals and services across India.",
    url: "https://smartprofile.in/directory",
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
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, business_name, full_name, city")
    .eq("is_active", true)
    .limit(MAX_ITEMLIST_ENTRIES);

  const itemListElements = (profiles || [])
    .filter((p) => p.city)
    .map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://smartprofile.in/directory/${slugifyCity(p.city)}/${p.username}`,
      name: p.business_name || p.full_name || p.username,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://smartprofile.in/directory#collection",
        name: "SmartProfile Business Directory",
        description:
          "Search and discover verified businesses, professionals and services across India.",
        url: "https://smartprofile.in/directory",
      },
      // Lightweight references only (url + name) — each listing's own page
      // carries its full LocalBusiness/AggregateRating schema. Google
      // doesn't allow an AggregateRating on a collection/list page anyway,
      // so this list intentionally doesn't nest ratings.
      ...(itemListElements.length > 0
        ? [
            {
              "@type": "ItemList",
              "@id": "https://smartprofile.in/directory#itemlist",
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
      <DirectoryClient />
    </>
  );
}