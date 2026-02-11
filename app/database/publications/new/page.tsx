import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';

import NewPublicationContent from './content';

export const metadata: Metadata = {
  title: 'Add Publication',
  description: 'Add a new publication',
};

export default function NewPublicationPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewPublicationContent />
    </Suspense>
  );
}
