import { Suspense } from 'react';
import { Metadata } from 'next';

import { getMovies } from '@/lib/data';

import MoviesContent, { MoviesSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Movies - Zulfikar',
  description: 'A list of movies I have watched and recommend',
};

async function MoviesList() {
  const movies = await getMovies();
  return <MoviesContent movies={movies} />;
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<MoviesSkeleton />}>
      <MoviesList />
    </Suspense>
  );
}
