import { Metadata } from 'next';
import AnalyticsContent from './content';

export const metadata: Metadata = {
  title: 'Analytics - Zulfikar',
  description: 'Website traffic and visitor statistics.',
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
