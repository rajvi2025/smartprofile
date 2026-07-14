import { createClient } from "@supabase/supabase-js";
import CityClient from "./CityClient";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// Converts a city name like "New Delhi" into a URL-safe slug like "new-delhi"
function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

// Fallback display name if no business with this city slug exists yet —
// turns "new-delhi" into "New Delhi" so the page still reads naturally.
function titleCaseFromSlug(slug) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { city } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("city")
    .eq("is_active", true);

  const cityBusinesses = (profiles || []).filter((p) => slugifyCity(p.city) === city);
  const cityName = cityBusinesses[0]?.city || titleCaseFromSlug(city);
  const count = cityBusinesses.length;

  // No businesses in this city yet — keep the page live (so it doesn't
  // 404), but noindex it. An empty directory page is thin/low-value
  // content and shouldn't be competing for rankings until it has real
  // listings. `follow` stays true so Google can still crawl through to
  // other pages linked from here.
  if (count === 0) {
    return {
      title: `${cityName} Business Directory | SmartProfile`,
      description: `Business listings in ${cityName} are coming soon on SmartProfile Directory.`,
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `https://smartprofile.in/directory/${city}`;
  const description = `Find ${count} verified business${count === 1 ? "" : "es"} in ${cityName} — contact details, reviews, products and services, all on SmartProfile Directory.`;

  return {
    title: `Business Directory in ${cityName} - ${count} Verified Business${count === 1 ? "" : "es"} | SmartProfile`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Business Directory in ${cityName}`,
      description,
      url: canonicalUrl,
      siteName: "SmartProfile Directory",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Business Directory in ${cityName}`,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { city } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true);

  const cityBusinesses = (profiles || []).filter((p) => slugifyCity(p.city) === city);

  let jsonLd = null;

  if (cityBusinesses.length > 0) {
    const cityName = cityBusinesses[0].city;
    const pageUrl = `https://smartprofile.in/directory/${city}`;

    const itemListNode = {
      "@type": "ItemList",
      itemListElement: cityBusinesses.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://smartprofile.in/directory/${slugifyCity(p.city)}/${p.username}`,
        name: p.business_name || p.full_name || p.username,
      })),
    };

    const collectionNode = {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: `Business Directory in ${cityName}`,
      url: pageUrl,
      mainEntity: itemListNode,
    };

    const breadcrumbNode = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://smartprofile.in" },
        { "@type": "ListItem", position: 2, name: "Directory", item: "https://smartprofile.in/directory" },
        { "@type": "ListItem", position: 3, name: cityName },
      ],
    };

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [collectionNode, breadcrumbNode],
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CityClient citySlug={city} />
    </>
  );
}