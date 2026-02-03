import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';

import ReadingListNewContent from './content';

export const metadata: Metadata = {
  title: 'Add Book - Zulfikar',
  description: 'Add a new book',
};

export default function NewBookPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <ReadingListNewContent />
    </Suspense>
  );
}
