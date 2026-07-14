"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Client component (required by Next.js for error boundaries).
// Catches runtime errors on any page under this segment and shows a
// friendly recovery screen instead of a blank/broken page.
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to console for now — swap in a real error-reporting service later if needed.
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #eff6ff 100%)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, textDecoration: "none" }}>
          <Image src="/logo-icon.png" alt="SmartProfile" width={40} height={40} priority />
          <span style={{ fontWeight: 800, fontSize: 22 }}>
            <span style={{ color: "#001144" }}>Smart</span><span style={{ color: "#005DFF" }}>Profile</span>
          </span>
        </Link>

        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>Something Went Wrong</h1>
        <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
          We hit an unexpected error loading this page. This has been logged — please try again, or head back home.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => reset()} style={{ padding: "12px 28px", background: "#005DFF", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Try Again
          </button>
          <Link href="/" style={{ padding: "12px 28px", background: "white", color: "#005DFF", border: "1.5px solid #005DFF", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
            Go to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
