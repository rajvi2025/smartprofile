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
    sitemap: [
      "https://www.smartprofile.in/sitemap.xml",
      "https://www.smartprofile.in/sitemap-images.xml",
    ],
  };
}