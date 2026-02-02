import { Suspense } from 'react';
import { Metadata } from 'next';

import { getPublications } from '@/lib/data';

import PublicationsContent, { PublicationsSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Publications - Zulfikar',
  description: 'My academic and professional publications',
};

async function PublicationsList() {
  const publications = await getPublications();
  return <PublicationsContent publications={publications} />;
}

export default function PublicationsPage() {
  return (
    <Suspense fallback={<PublicationsSkeleton />}>
      <PublicationsList />
    </Suspense>
  );
}
