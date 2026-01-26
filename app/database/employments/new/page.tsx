import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/Form/Loading';

import NewEmploymentContent from './content';

export const metadata: Metadata = {
  title: 'Add Employment - Zulfikar',
  description: 'Add a new employment',
};

export default function NewEmploymentPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewEmploymentContent />
    </Suspense>
  );
}
