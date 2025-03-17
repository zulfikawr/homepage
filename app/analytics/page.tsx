import { Metadata } from 'next';
import AnalyticsContent from './content';

export const metadata: Metadata = {
  title: 'Analytics - Zulfikar',
};

export default function DashboardPage() {
  return <AnalyticsContent />;
}
