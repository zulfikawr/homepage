import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';

import NewProjectContent from './content';

export const metadata: Metadata = {
  title: 'Add Post',
  description: 'Add a new post',
};

export default function NewProjectPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewProjectContent />
    </Suspense>
  );
}
