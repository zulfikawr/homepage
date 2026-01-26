import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/Form/Loading';

import NewMovieContent from './content';

export const metadata: Metadata = {
  title: 'Add Movie - Zulfikar',
  description: 'Add a new movie to your list',
};

export default function NewMoviePage() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <NewMovieContent />
    </Suspense>
  );
}
