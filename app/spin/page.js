import SpinClient from "./SpinClient";

export const metadata = {
  title: "Spin & Win | SmartProfile",
  description: "Spin the wheel and win exclusive discount coupons on your SmartProfile digital business card plan.",
  alternates: { canonical: "https://www.smartprofile.in/spin" },
  openGraph: {
    title: "Spin & Win | SmartProfile",
    description: "Spin the wheel and win exclusive discount coupons on your SmartProfile plan.",
    url: "https://www.smartprofile.in/spin",
    siteName: "SmartProfile",
    type: "website",
    images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Spin & Win | SmartProfile",
    description: "Spin the wheel and win exclusive discount coupons.",
  },
};

export default function SpinPage() {
  return <SpinClient />;
}