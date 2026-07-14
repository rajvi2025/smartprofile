import { createClient } from "@supabase/supabase-js";
import CategoryClient from "./CategoryClient";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

function slugifyCategory(category) {
  return (category || "").toLowerCase().trim().replace(/\s+/g, "-");
}

function slugifyCity(city) {
  return (city || "").toLowerCase().trim().replace(/\s+/g, "-");
}

// Fallback display name if no business with this category slug exists yet
function titleCaseFromSlug(slug) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }) {
  const { category } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("category")
    .eq("is_active", true);

  const categoryBusinesses = (profiles || []).filter((p) => slugifyCategory(p.category) === category);
  const categoryName = categoryBusinesses[0]?.category || titleCaseFromSlug(category);
  const count = categoryBusinesses.length;

  // No businesses in this category yet — keep the page live but noindex it,
  // same reasoning as empty city pages: thin/empty content shouldn't
  // compete for rankings until it has real listings.
  if (count === 0) {
    return {
      title: `${categoryName} - Business Directory | SmartProfile`,
      description: `${categoryName} listings are coming soon on SmartProfile Directory.`,
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `https://smartprofile.in/directory/category/${category}`;
  const description = `Find ${count} verified ${categoryName}${count === 1 ? "" : "es"} across India — contact details, reviews, products and services, all on SmartProfile Directory.`;

  return {
    title: `${categoryName} - ${count} Verified Business${count === 1 ? "" : "es"} | SmartProfile Directory`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${categoryName} - SmartProfile Directory`,
      description,
      url: canonicalUrl,
      siteName: "SmartProfile Directory",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${categoryName} - SmartProfile Directory`,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { category } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true);

  const categoryBusinesses = (profiles || []).filter((p) => slugifyCategory(p.category) === category);

  let jsonLd = null;

  if (categoryBusinesses.length > 0) {
    const categoryName = categoryBusinesses[0].category;
    const pageUrl = `https://smartprofile.in/directory/category/${category}`;

    const itemListNode = {
      "@type": "ItemList",
      itemListElement: categoryBusinesses.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://smartprofile.in/directory/${slugifyCity(p.city)}/${p.username}`,
        name: p.business_name || p.full_name || p.username,
      })),
    };

    const collectionNode = {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: `${categoryName} - SmartProfile Directory`,
      url: pageUrl,
      mainEntity: itemListNode,
    };

    const breadcrumbNode = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://smartprofile.in" },
        { "@type": "ListItem", position: 2, name: "Directory", item: "https://smartprofile.in/directory" },
        { "@type": "ListItem", position: 3, name: categoryName },
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
      <CategoryClient categorySlug={category} />
    </>
  );
}