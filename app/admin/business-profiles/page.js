import BusinessProfilesClient from './BusinessProfilesClient';

export const metadata = {
  title: 'Business Profiles | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function BusinessProfilesPage() {
  return <BusinessProfilesClient />;
}