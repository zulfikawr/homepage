import { Metadata } from 'next';
import NewProjectContent from './content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add Post - Zulfikar',
  description: 'Add a new post',
};

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProjectContent />
    </Suspense>
  );
}
