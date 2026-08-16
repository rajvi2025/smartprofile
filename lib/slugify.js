// Shared slug helpers used across every directory page (individual listing,
// city, category, and city+category combo) plus both sitemaps. Centralizing
// this here means a city or category always slugifies to the exact same
// URL everywhere on the site — no risk of two pages disagreeing on how
// "Handicrafts & Home Décor" should look in a URL.
//
// Handles the two things the old inline version (duplicated in ~10 files)
// missed: accented characters (é, ñ, etc.) and symbols like "&" — both of
// which were leaking into URLs unencoded/ugly. Update this file only when
// the slug format needs to change; every page picks it up automatically.

export function slugify(input) {
  return (input || "")
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents: é -> e, ñ -> n, etc.
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "") // drop remaining punctuation/symbols
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyCity(city) {
  return slugify(city);
}

export function slugifyCategory(category) {
  return slugify(category);
}

export function slugifyState(state) {
  return slugify(state);
}

// Fallback display name when a slug doesn't match any known business yet
// (e.g. an empty city/category page) — turns "new-delhi" into "New Delhi".
export function titleCaseFromSlug(slug) {
  return (slug || "")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}