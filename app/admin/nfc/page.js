import NfcOrdersClient from './NfcOrdersClient';

export const metadata = {
  title: 'NFC Management | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function NfcManagementPage() {
  return <NfcOrdersClient />;
}