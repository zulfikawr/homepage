import { Metadata } from 'next';
import NewProjectContent from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

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
