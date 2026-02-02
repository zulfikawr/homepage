import { Suspense } from 'react';
import { Metadata } from 'next';

import { getAnalyticsEvents } from '@/lib/data';

import AnalyticsContent, { AnalyticsSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Analytics - Zulfikar',
  description: 'Website traffic and visitor statistics.',
};

async function Analytics() {
  const events = await getAnalyticsEvents();
  return <AnalyticsContent events={events} />;
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <Analytics />
    </Suspense>
  );
}
