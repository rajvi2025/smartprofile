// A review-submission form has no unique content worth ranking — every
// business's version of this page is the same generic template, which is
// exactly why Ahrefs was flagging these as duplicate pages without a
// canonical. Noindexing (same approach as /login, /register) is the right
// fix rather than trying to canonicalize near-identical form pages.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function ReviewLayout({ children }) {
  return children;
}