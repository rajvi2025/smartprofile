import FreeListingClient from "./FreeListingClient";

export const metadata = {
  title: "Get Listed Free in SmartProfile Business Directory | SmartProfile",
  description: "List your business for free on SmartProfile's Business Directory. Get discovered by local customers searching by city and category.",
  alternates: { canonical: "https://www.smartprofile.in/free-listing" },
  openGraph: {
    title: "Get Listed Free in SmartProfile Business Directory",
    description: "List your business for free and get discovered by local customers searching by city and category.",
    url: "https://www.smartprofile.in/free-listing",
    siteName: "SmartProfile",
    type: "website",
    images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Get Listed Free in SmartProfile Business Directory",
    description: "List your business for free and get discovered by local customers.",
  },
};

export default function FreeListingPage() {
  return <FreeListingClient />;
}