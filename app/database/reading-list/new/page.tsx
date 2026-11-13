import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';
import BookForm from '@/components/form/book';

import ReadingListNewContent from './content';

export const metadata: Metadata = {
  title: 'Add Book',
  description: 'Add a new book',
};

export default function NewBookPage() {
  return (
    <Suspense
      fallback={
        <FormSkeleton>
          <BookForm />
        </FormSkeleton>
      }
    >
      <ReadingListNewContent />
    </Suspense>
  );
}
