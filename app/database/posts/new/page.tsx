import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';
import PostForm from '@/components/form/post';

import NewProjectContent from './content';

export const metadata: Metadata = {
  title: 'Add Post',
  description: 'Add a new post',
};

export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <FormSkeleton>
          <PostForm />
        </FormSkeleton>
      }
    >
      <NewProjectContent />
    </Suspense>
  );
}
