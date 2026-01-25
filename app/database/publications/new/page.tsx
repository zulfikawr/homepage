import { Metadata } from 'next';
import NewPublicationContent from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

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
