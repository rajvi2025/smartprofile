import { createClient } from "@supabase/supabase-js";
import ComboClient from "./ComboClient";
import { slugifyCity, slugifyCategory, titleCaseFromSlug } from "@/lib/slugify";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// This is the highest-intent URL pattern in the directory — "electrician in
// Thane" style searches — so it applies the same approved-only rule as the
// individual listing page (see [username]/page.js): only admin-approved,
// active listings count toward this page's content and its indexability.
export async function generateMetadata({ params }) {
  const { city, category } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("city, category")
    .eq("is_active", true)
    .eq("status", "approved");

  const matched = (profiles || []).filter(
    (p) => slugifyCity(p.city) === city && slugifyCategory(p.category) === category
  );
  const cityName = matched[0]?.city || titleCaseFromSlug(city);
  const categoryName = matched[0]?.category || titleCaseFromSlug(category);
  const count = matched.length;

  // No matching businesses yet — keep the page live (so it doesn't 404 and
  // can still be linked to from city/category pages), but noindex it.
  // Thin/empty combo pages shouldn't compete for rankings until they have
  // real listings backing them.
  if (count === 0) {
    return {
      title: `${categoryName} in ${cityName} | SmartProfile Directory`,
      description: `${categoryName} listings in ${cityName} are coming soon on SmartProfile Directory.`,
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `https://www.smartprofile.in/directory/${city}/category/${category}`;
  const description = `Find ${count} verified ${categoryName}${count === 1 ? "" : "es"} in ${cityName} — contact details, reviews, products and services, all on SmartProfile Directory.`;

  return {
    title: `${categoryName} in ${cityName} | SmartProfile Directory`,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${categoryName} in ${cityName}`,
      description,
      url: canonicalUrl,
      siteName: "SmartProfile Directory",
      type: "website",
      images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
    },
    twitter: {
      card: "summary",
      title: `${categoryName} in ${cityName}`,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { city, category } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .eq("status", "approved");

  const matched = (profiles || []).filter(
    (p) => slugifyCity(p.city) === city && slugifyCategory(p.category) === category
  );

  let jsonLd = null;

  if (matched.length > 0) {
    const cityName = matched[0].city;
    const categoryName = matched[0].category;
    const pageUrl = `https://www.smartprofile.in/directory/${city}/category/${category}`;

    const itemListNode = {
      "@type": "ItemList",
      itemListElement: matched.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.smartprofile.in/directory/${slugifyCity(p.city)}/${p.username}`,
        name: p.business_name || p.full_name || p.username,
      })),
    };

    const collectionNode = {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: `${categoryName} in ${cityName} - SmartProfile Directory`,
      url: pageUrl,
      mainEntity: itemListNode,
    };

    const breadcrumbNode = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartprofile.in" },
        { "@type": "ListItem", position: 2, name: "Directory", item: "https://www.smartprofile.in/directory" },
        { "@type": "ListItem", position: 3, name: cityName, item: `https://www.smartprofile.in/directory/${city}` },
        { "@type": "ListItem", position: 4, name: categoryName },
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
      <ComboClient citySlug={city} categorySlug={category} />
    </>
  );
}