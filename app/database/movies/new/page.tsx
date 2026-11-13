import { Suspense } from 'react';
import { Metadata } from 'next';

import { FormSkeleton } from '@/components/form/loading';
import MovieForm from '@/components/form/movie';

import NewMovieContent from './content';

export const metadata: Metadata = {
  title: 'Add Movie',
  description: 'Add a new movie to your list',
};

export default function NewMoviePage() {
  return (
    <Suspense
      fallback={
        <FormSkeleton>
          <MovieForm />
        </FormSkeleton>
      }
    >
      <NewMovieContent />
    </Suspense>
  );
}
