// A signup wall has no content worth ranking and shouldn't be a search
// entry point. robots.txt already disallows crawling /register — this
// noindex meta is a second, stronger guarantee.
export const metadata = {
  title: "Sign Up | SmartProfile",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }) {
  return children;
}