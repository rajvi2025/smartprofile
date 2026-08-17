import PaymentsClient from './PaymentsClient';

export const metadata = {
  title: 'Payments | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function PaymentsPage() {
  return <PaymentsClient />;
}