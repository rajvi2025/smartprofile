import ReviewsClient from './ReviewsClient';

export const metadata = {
  title: 'Reviews | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}