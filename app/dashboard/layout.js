// The customer dashboard is private account content and must never be
// indexed. robots.txt already disallows crawling /dashboard — this noindex
// meta is a second, stronger guarantee that holds even if a dashboard URL
// gets linked or crawled some other way.
export const metadata = {
  title: "Dashboard | SmartProfile",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return children;
}