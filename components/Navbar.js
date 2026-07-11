"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const RESERVED_TOP_LEVEL = [
  '', 'admin', 'api', 'contact', 'dashboard', 'directory', 'free-listing',
  'login', 'privacy', 'refund', 'register', 'shipping', 'terms', 'blog', 'pricing',
];

function isDigitalCardRoute(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return false;
  if (RESERVED_TOP_LEVEL.includes(parts[0])) return false;
  if (parts.length === 1) return true;
  if (parts.length === 2 && parts[1] === 'review') return true;
  return false;
}

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (isDigitalCardRoute(pathname)) return null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>
          <span className="font-bold text-xl"><span className="text-gray-900">Smart</span><span className="text-blue-600">Profile</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Home</Link>
          <Link href="/#features" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Features</Link>
          <Link href="/#nfc" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">NFC Cards</Link>
          <Link href="/directory" className="text-blue-600 font-medium text-sm border-b-2 border-blue-600 pb-0.5">Directory</Link>
          <Link href="/#pricing" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Pricing</Link>
          <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Blog</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Attractive "List Your Business Free" badge */}
          <Link
            href="/free-listing"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full text-white shadow-sm hover:shadow-md transition-shadow"
            style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            List Your Business Free
          </Link>

          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Dashboard</Link>
              <button onClick={() => signOut()} className="text-sm text-gray-600 hover:text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:border-blue-400 transition">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <Link href="/free-listing" className="flex items-center justify-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-lg text-white" style={{ background: "linear-gradient(135deg, #f97316, #ef4444)" }} onClick={closeMenu}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            List Your Business Free
          </Link>
          <Link href="/" className="text-gray-600 text-sm font-medium" onClick={closeMenu}>Home</Link>
          <Link href="/#features" className="text-gray-600 text-sm font-medium" onClick={closeMenu}>Features</Link>
          <Link href="/#nfc" className="text-gray-600 text-sm font-medium" onClick={closeMenu}>NFC Cards</Link>
          <Link href="/directory" className="text-blue-600 text-sm font-medium" onClick={closeMenu}>Directory</Link>
          <Link href="/#pricing" className="text-gray-600 text-sm font-medium" onClick={closeMenu}>Pricing</Link>
          <Link href="/blog" className="text-gray-600 text-sm font-medium" onClick={closeMenu}>Blog</Link>
          <Link href="/contact" className="text-gray-600 text-sm font-medium" onClick={closeMenu}>Contact</Link>
          <div className="flex gap-3 mt-2">
            <Link href="/login" className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium" onClick={closeMenu}>Login</Link>
            <Link href="/register" className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium" onClick={closeMenu}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}