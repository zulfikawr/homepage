import { Metadata } from 'next';
import NewEmploymentContent from './content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add Employment - Zulfikar',
  description: 'Add a new employment',
};

export default function NewEmploymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewEmploymentContent />
    </Suspense>
  );
}
