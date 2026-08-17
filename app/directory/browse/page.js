import { supabase } from "@/lib/supabase";
import BrowseClient from "./BrowseClient";

export const metadata = {
  title: "Browse All Cities & Categories | SmartProfile Directory",
  description:
    "Browse the full list of cities, business categories, and locations covered by SmartProfile Directory across India.",
  alternates: { canonical: "https://www.smartprofile.in/directory/browse" },
  openGraph: {
    title: "Browse All Cities & Categories | SmartProfile Directory",
    description:
      "Browse the full list of cities, business categories, and locations covered by SmartProfile Directory across India.",
    url: "https://www.smartprofile.in/directory/browse",
    siteName: "SmartProfile Directory",
    type: "website",
  },
};

export default async function Page() {
  const { data: profiles } = await supabase
    .from("profiles")
    .select("city, category, state")
    .eq("is_active", true);

  return <BrowseClient profiles={profiles || []} />;
}