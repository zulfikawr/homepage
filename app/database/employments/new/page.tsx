import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';
import EmploymentForm from '@/components/form/employment';

import NewEmploymentContent from './content';

export const metadata: Metadata = {
  title: 'Add Employment',
  description: 'Add a new employment',
};

export default function NewEmploymentPage() {
  return (
    <Suspense
      fallback={
        <FormSkeleton>
          <EmploymentForm />
        </FormSkeleton>
      }
    >
      <NewEmploymentContent />
    </Suspense>
  );
}
