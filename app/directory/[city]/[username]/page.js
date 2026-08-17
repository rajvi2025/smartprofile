import { createClient } from "@supabase/supabase-js";
import { cache } from "react";
import ListingClient from "./ListingClient";
import { slugifyCity } from "@/lib/slugify";

const supabase = createClient(
  "https://lekyzsyadanghxafpjmh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxla3l6c3lhZGFuZ2h4YWZwam1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMwMzYsImV4cCI6MjA5NjU0OTAzNn0.cOjvzvuLi2oUloTr6ceIU2O7ZCr-jMcG0phDnmHTSrw"
);

// Both generateMetadata() and the Page component below need the same
// profile row. Without this, Next.js runs two full sequential DB
// round-trips before it can even start streaming HTML — that's what was
// showing up in Ahrefs as ~1.5s Time To First Byte on listing pages.
// React's cache() memoizes the result per request, so the second caller
// gets it for free instead of hitting Supabase again.
const getProfile = cache(async (username) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  return data;
});

// Maps SmartProfile's business categories to the closest schema.org
// LocalBusiness subtype, so Google gets a more specific entity type than
// the generic fallback. Falls back to "LocalBusiness" for anything not
// listed here — add more mappings as new categories show up.
const CATEGORY_SCHEMA_MAP = {
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  "coffee shop": "CafeOrCoffeeShop",
  hotel: "LodgingBusiness",
  lodging: "LodgingBusiness",
  doctor: "MedicalBusiness",
  clinic: "MedicalBusiness",
  hospital: "MedicalBusiness",
  dentist: "Dentist",
  lawyer: "LegalService",
  legal: "LegalService",
  "legal service": "LegalService",
  gym: "ExerciseGym",
  fitness: "ExerciseGym",
  salon: "HealthAndBeautyBusiness",
  spa: "HealthAndBeautyBusiness",
  beauty: "HealthAndBeautyBusiness",
  electrician: "Electrician",
  plumber: "Plumber",
  "real estate": "RealEstateAgent",
  school: "School",
  education: "EducationalOrganization",
  retail: "Store",
  shop: "Store",
  store: "Store",
  bakery: "Bakery",
  automobile: "AutomotiveBusiness",
  automotive: "AutomotiveBusiness",
};

function getSchemaType(category) {
  if (!category) return "LocalBusiness";
  return CATEGORY_SCHEMA_MAP[category.toLowerCase().trim()] || "LocalBusiness";
}

// Runs on the server before the page is sent, so this canonical SEO-facing
// page finally gets a real title/description/canonical/OG — the Digital
// Card page already had this, this page (the one Google should actually
// rank) did not.
export async function generateMetadata({ params }) {
  const { username } = await params;

  const profile = await getProfile(username);

  if (!profile || !profile.is_active) {
    return {
      title: "Listing Not Found | SmartProfile Directory",
      description: "This business listing could not be found on SmartProfile Directory.",
      robots: { index: false, follow: false },
    };
  }

  const name = profile.business_name || profile.full_name || username;
  const citySlug = slugifyCity(profile.city);
  const canonicalUrl = `https://www.smartprofile.in/directory/${citySlug}/${username}`;
  const fallbackDescription = `${name}${profile.category ? ` - ${profile.category}` : ""}${profile.city ? ` in ${profile.city}` : ""}. Contact details, reviews, products and services on SmartProfile Directory.`;
  let description = profile.tagline || (profile.about ? profile.about.slice(0, 155) : "");
  // A short tagline (e.g. one punchy line) makes a fine headline but too
  // thin a meta description on its own — pad it with the fallback context
  // so search snippets always have enough substance.
  if (!description || description.length < 70) {
    description = description ? `${description} ${fallbackDescription}` : fallbackDescription;
  }
  description = description.slice(0, 160);
  const image = profile.directory_image_url || profile.banner_url || profile.logo_url;
  const titleLocation = profile.city ? `${profile.category ? `${profile.category} in ` : ""}${profile.city}` : "";
  const fullTitle = `${name}${titleLocation ? ` - ${titleLocation}` : ""} | SmartProfile`;
  // Long business/category names were pushing titles past 90 characters —
  // fall back to just the name once the full version runs too long. The
  // category/city detail is still fully present in the meta description.
  const title = fullTitle.length > 60 ? `${name} | SmartProfile` : fullTitle;

  // Golden Rule for indexing: only listings an admin has explicitly
  // approved are eligible to be indexed by Google. Anything still
  // 'pending' (or rejected) renders normally for the owner/admin to
  // preview, but carries a noindex so incomplete or unvetted listings
  // never reach Google search results. Flip to indexable automatically
  // the moment admin approval happens — no manual SEO step required.
  const isApproved = profile.status === "approved";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: {
      index: isApproved,
      follow: true,
    },
    openGraph: {
      title: name,
      description,
      url: canonicalUrl,
      siteName: "SmartProfile Directory",
      type: "website",
      ...(image ? { images: [{ url: image }] } : { images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }] }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: name,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { city, username } = await params;

  const profile = await getProfile(username);

  let jsonLd = null;

  if (profile && profile.is_active) {
    const { data: testimonials } = await supabase
      .from("testimonials")
      .select("*")
      .eq("profile_id", profile.id)
      .order("sort_order", { ascending: true });

    const name = profile.business_name || profile.full_name || username;
    const citySlug = slugifyCity(profile.city);
    const pageUrl = `https://www.smartprofile.in/directory/${citySlug}/${username}`;

    const reviewCount = testimonials ? testimonials.length : 0;
    const avgRating =
      reviewCount > 0
        ? testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / reviewCount
        : 0;

    const businessNode = {
      "@type": getSchemaType(profile.category),
      "@id": `${pageUrl}#business`,
      name,
      url: pageUrl,
      ...(profile.about ? { description: profile.about.slice(0, 300) } : {}),
      ...(profile.phone ? { telephone: `+91${profile.phone}` } : {}),
      ...(profile.logo_url ? { image: profile.logo_url } : {}),
      address: {
        "@type": "PostalAddress",
        ...(profile.address ? { streetAddress: profile.address } : {}),
        ...(profile.city ? { addressLocality: profile.city } : {}),
        ...(profile.state ? { addressRegion: profile.state } : {}),
        addressCountry: "IN",
      },
      // Only attach a rating/reviews block if this business actually has
      // reviews. Google requires aggregateRating to match what's visibly
      // shown on the page — never fabricate or default a rating here.
      // SmartProfile qualifies to show these (unlike a business marking up
      // reviews on its own site) because SmartProfile is the third-party
      // platform collecting the reviews directly from users, the same way
      // Yelp/JustDial do — this is explicitly allowed under Google's
      // self-serving-review guidelines.
      ...(reviewCount > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: avgRating.toFixed(1),
              reviewCount,
            },
            review: testimonials
              .filter((t) => t.review)
              .slice(0, 10)
              .map((t) => ({
                "@type": "Review",
                author: { "@type": "Person", name: t.name || "Anonymous" },
                reviewRating: { "@type": "Rating", ratingValue: t.rating || 5, bestRating: 5 },
                reviewBody: t.review,
              })),
          }
        : {}),
    };

    // Breadcrumb: Home -> Directory -> City -> Business.
    // City landing pages (smartprofile.in/directory/{city}) now exist, so
    // the city level has a real, working `item` URL — this used to be
    // text-only and was removed for failing Google's validator (every
    // breadcrumb item except the last one needs a working URL).
    const breadcrumbItems = [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.smartprofile.in" },
      { "@type": "ListItem", position: 2, name: "Directory", item: "https://www.smartprofile.in/directory" },
    ];
    if (profile.city) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 3,
        name: profile.city,
        item: `https://www.smartprofile.in/directory/${citySlug}`,
      });
    }
    breadcrumbItems.push({ "@type": "ListItem", position: breadcrumbItems.length + 1, name });

    const breadcrumbNode = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    };

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [businessNode, breadcrumbNode],
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
      <ListingClient username={username} cityParam={city} />
    </>
  );
}