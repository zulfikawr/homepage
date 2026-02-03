import { Suspense } from 'react';
import { Metadata } from 'next';

import { getAnalyticsSummary } from '@/lib/data';

import AnalyticsContent, { AnalyticsSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Analytics - Zulfikar',
  description: 'Website traffic and visitor statistics.',
};

async function Analytics() {
  const stats = await getAnalyticsSummary();
  return <AnalyticsContent stats={stats} />;
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <Analytics />
    </Suspense>
  );
}
