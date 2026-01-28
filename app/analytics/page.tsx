import { Metadata } from 'next';

import { getAnalyticsEvents } from '@/database/analytics_events';

import AnalyticsContent from './content';

export const metadata: Metadata = {
  title: 'Analytics - Zulfikar',
  description: 'Website traffic and visitor statistics.',
};

export default async function AnalyticsPage() {
  const events = await getAnalyticsEvents();
  return <AnalyticsContent initialData={events} />;
}
