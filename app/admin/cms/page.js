import CmsClient from './CmsClient';

export const metadata = {
  title: 'CMS | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function CmsPage() {
  return <CmsClient />;
}