import Link from "next/link";
import Image from "next/image";

// Server component — Next.js automatically returns a real 404 HTTP status
// for this page. We additionally set noindex so Google never indexes it
// (avoids "soft 404" issues in Search Console), while still linking out
// to real pages so both users and Googlebot can continue browsing.
export const metadata = {
  title: "Page Not Found | SmartProfile",
  description: "The page you're looking for doesn't exist or may have been moved.",
  robots: { index: false, follow: true },
};

const POPULAR_LINKS = [
  { href: "/directory", label: "Browse Business Directory" },
  { href: "/directory/mumbai", label: "Businesses in Mumbai" },
  { href: "/directory/thane", label: "Businesses in Thane" },
  { href: "/register", label: "List Your Business Free" },
];

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #eff6ff 100%)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, textDecoration: "none" }}>
          <Image src="/logo-icon.png" alt="SmartProfile" width={40} height={40} priority />
          <span style={{ fontWeight: 800, fontSize: 22 }}>
            <span style={{ color: "#001144" }}>Smart</span><span style={{ color: "#005DFF" }}>Profile</span>
          </span>
        </Link>

        <div style={{ fontSize: 96, fontWeight: 800, color: "#005DFF", lineHeight: 1, marginBottom: 8, letterSpacing: -2 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 36 }}>
          The page you're looking for doesn't exist, may have been moved, or the business listing is no longer active.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <Link href="/" style={{ padding: "12px 28px", background: "#005DFF", color: "white", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Go to Homepage
          </Link>
          <Link href="/directory" style={{ padding: "12px 28px", background: "white", color: "#005DFF", border: "1.5px solid #005DFF", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Browse Directory
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", textAlign: "left" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>You might be looking for:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {POPULAR_LINKS.map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: 13, color: "#005DFF", textDecoration: "none" }}>
                → {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
