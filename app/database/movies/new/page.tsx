import { Metadata } from 'next';
import NewMovieContent from './content';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Add Movie - Zulfikar',
  description: 'Add a new movie to your list',
};

export default function NewMoviePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewMovieContent />
    </Suspense>
  );
}
