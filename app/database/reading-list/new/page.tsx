import { Metadata } from 'next';
import NewBookContent from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

export const metadata: Metadata = {
  title: 'Add Book - Zulfikar',
  description: 'Add a new book',
};

export default function NewEmploymentPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewBookContent />
    </Suspense>
  );
}
