import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/Form/Loading';

import NewPublicationContent from './content';

export const metadata: Metadata = {
  title: 'Add Publication - Zulfikar',
  description: 'Add a new publication',
};

export default function NewPublicationPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewPublicationContent />
    </Suspense>
  );
}
