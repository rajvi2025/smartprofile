import AdminLayoutClient from "./AdminLayoutClient";

// Admin panel must never be indexed — robots.txt already disallows crawling
// it, but this noindex meta is a second, stronger guarantee: even if a page
// gets linked from somewhere and crawled anyway, it still won't be indexed.
export const metadata = {
  title: "Admin | SmartProfile",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}