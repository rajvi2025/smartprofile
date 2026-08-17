import { createClient } from "@supabase/supabase-js";
import StateClient from "./StateClient";
import { slugifyCity, slugifyState, titleCaseFromSlug } from "@/lib/slugify";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// Same approved-only rule as every other directory page (see
// [username]/page.js) — a pending listing shouldn't count toward a state
// page's business count or its indexability.
export async function generateMetadata({ params }) {
  const { state } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("state")
    .eq("is_active", true)
    .eq("status", "approved");

  const stateBusinesses = (profiles || []).filter((p) => slugifyState(p.state) === state);
  const stateName = stateBusinesses[0]?.state || titleCaseFromSlug(state);
  const count = stateBusinesses.length;

  // No businesses in this state yet — keep the page live (so it doesn't
  // 404 and future links to it don't break), but noindex it. Same
  // reasoning as empty city/category pages: thin content shouldn't
  // compete for rankings until it has real listings.
  if (count === 0) {
    return {
      title: `${stateName} Business Directory | SmartProfile`,
      description: `Business listings in ${stateName} are coming soon on SmartProfile Directory.`,
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `https://www.smartprofile.in/directory/state/${state}`;
  const description = `Find ${count} verified business${count === 1 ? "" : "es"} across ${stateName} — contact details, reviews, products and services, all on SmartProfile Directory.`;

  return {
    title: `Business Directory in ${stateName} | SmartProfile`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Business Directory in ${stateName}`,
      description,
      url: canonicalUrl,
      siteName: "SmartProfile Directory",
      type: "website",
      images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
    },
    twitter: {
      card: "summary",
      title: `Business Directory in ${stateName}`,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { state } = await params;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_active", true)
    .eq("status", "approved");

  const stateBusinesses = (profiles || []).filter((p) => slugifyState(p.state) === state);

  let jsonLd = null;

  if (stateBusinesses.length > 0) {
    const stateName = stateBusinesses[0].state;
    const pageUrl = `https://www.smartprofile.in/directory/state/${state}`;

    // Cities within this state — used both for schema breadth and so the
    // page can offer real "browse by city" links, not just a flat business
    // list. Deduplicated and sorted for a stable render.
    const citiesInState = [
      ...new Set(stateBusinesses.filter((p) => p.city).map((p) => p.city)),
    ].sort();

    const itemListNode = {
      "@type": "ItemList",
      itemListElement: stateBusinesses.slice(0, 50).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.smartprofile.in/directory/${slugifyCity(p.city)}/${p.username}`,
        name: p.business_name || p.full_name || p.username,
      })),
    };

    const collectionNode = {
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: `Business Directory in ${stateName}`,
      url: pageUrl,
      mainEntity: itemListNode,
    };

    const breadcrumbNode = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartprofile.in" },
        { "@type": "ListItem", position: 2, name: "Directory", item: "https://www.smartprofile.in/directory" },
        { "@type": "ListItem", position: 3, name: stateName },
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
      <StateClient stateSlug={state} />
    </>
  );
}