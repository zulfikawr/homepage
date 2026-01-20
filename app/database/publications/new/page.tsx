import { Metadata } from 'next';
import NewPublicationContent from './content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add Publication - Zulfikar',
  description: 'Add a new publication',
};

export default function NewPublicationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPublicationContent />
    </Suspense>
  );
}
