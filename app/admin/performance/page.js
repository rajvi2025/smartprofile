import PerformanceClient from './PerformanceClient';

export const metadata = {
  title: 'Performance | SmartProfile Admin',
  robots: { index: false, follow: false },
};

export default function PerformancePage() {
  return <PerformanceClient />;
}