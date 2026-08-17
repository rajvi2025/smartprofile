import DemoClient from "./DemoClient";

export const metadata = {
  title: "See It Live — Real Business Profiles | SmartProfile",
  description: "See how SmartProfile looks for real businesses across every plan — Basic, Business, Premium, and Pro. View live demo profiles.",
  alternates: { canonical: "https://www.smartprofile.in/demo" },
  openGraph: {
    title: "See It Live — Real Business Profiles | SmartProfile",
    description: "See how SmartProfile looks for real businesses across every plan.",
    url: "https://www.smartprofile.in/demo",
    siteName: "SmartProfile",
    type: "website",
    images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "See It Live — Real Business Profiles | SmartProfile",
    description: "See how SmartProfile looks for real businesses across every plan.",
  },
};

export default function DemoPage() {
  return <DemoClient />;
}