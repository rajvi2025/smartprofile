import QrManagementClient from './QrManagementClient';

export const metadata = {
  title: 'QR Management | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function QrManagementPage() {
  return <QrManagementClient />;
}