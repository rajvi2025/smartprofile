export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/dashboard",
        "/dashboard/",
        "/login",
        "/register",
        "/api/",
      ],
    },
    sitemap: "https://smartprofile.in/sitemap.xml",
  };
}
