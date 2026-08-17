import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.smartprofile.in"),
  title: "SmartProfile.in",
  description: "One Link. Complete Business. Create your digital business card, get listed in our directory, and grow with SmartProfile — India's smart business platform.",
  openGraph: {
    title: "SmartProfile.in",
    description: "One Link. Complete Business. Create your digital business card, get listed in our directory, and grow with SmartProfile — India's smart business platform.",
    url: "https://www.smartprofile.in",
    siteName: "SmartProfile",
    type: "website",
    images: [{ url: "https://www.smartprofile.in/logo-icon.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "SmartProfile.in",
    description: "One Link. Complete Business. Create your digital business card, get listed in our directory, and grow with SmartProfile — India's smart business platform.",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-CV49J65FXZ" strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CV49J65FXZ');
        `}
      </Script>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
          <Footer />
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  );
}