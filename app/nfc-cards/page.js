import NfcCardsClient from "./NfcCardsClient";

export const metadata = {
  title: "NFC Smart Business Cards | SmartProfile",
  description: "Order a SmartProfile NFC Smart Card — tap it on any phone and your digital business profile opens instantly. No app needed. ₹599 only.",
  alternates: { canonical: "https://www.smartprofile.in/nfc-cards" },
  openGraph: {
    title: "NFC Smart Business Cards | SmartProfile",
    description: "Tap your NFC Smart Card on any phone — your digital business profile opens instantly. No app needed.",
    url: "https://www.smartprofile.in/nfc-cards",
    siteName: "SmartProfile",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NFC Smart Business Cards | SmartProfile",
    description: "Tap your NFC Smart Card on any phone — your digital business profile opens instantly.",
  },
};

export default function NfcCardsPage() {
  return <NfcCardsClient />;
}