import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/Form/Loading';

import NewProjectContent from './content';

export const metadata: Metadata = {
  title: 'Add Post - Zulfikar',
  description: 'Add a new post',
};

export default function NewProjectPage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewProjectContent />
    </Suspense>
  );
}
