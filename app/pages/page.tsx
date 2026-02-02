import { Suspense } from 'react';
import { Metadata } from 'next';

import { getResume } from '@/lib/data';

import PagesContent, { PagesSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Pages - Zulfikar',
};

async function Pages() {
  const resumeList = await getResume();
  const resume = resumeList?.[0] || null;
  return <PagesContent resume={resume} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<PagesSkeleton />}>
      <Pages />
    </Suspense>
  );
}
