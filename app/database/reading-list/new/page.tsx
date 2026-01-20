import { Metadata } from 'next';
import NewBookContent from './content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add Book - Zulfikar',
  description: 'Add a new book',
};

export default function NewEmploymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewBookContent />
    </Suspense>
  );
}
