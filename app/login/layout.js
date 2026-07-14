// A login page has no content worth ranking and shouldn't be a search
// entry point. robots.txt already disallows crawling /login — this noindex
// meta is a second, stronger guarantee.
export const metadata = {
  title: "Login | SmartProfile",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }) {
  return children;
}