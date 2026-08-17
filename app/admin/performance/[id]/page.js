import BusinessAnalyticsClient from './BusinessAnalyticsClient';

export const metadata = {
  title: 'Business Analytics | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default async function AdminBusinessAnalyticsPage({ params }) {
  const { id } = await params;
  return <BusinessAnalyticsClient profileId={id} />;
}