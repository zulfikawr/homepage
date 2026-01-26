'use client';

import { useEffect } from 'react';

import MovieForm from '@/components/Form/Movie';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import { Movie } from '@/types/movie';

interface EditMoviePageProps {
  movie: Movie;
}

export default function EditMoviePage({ movie }: EditMoviePageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${movie.title}`);
    return () => setHeaderTitle('Movies');
  }, [movie.title, setHeaderTitle]);

  return (
    <div>
      <PageTitle emoji='🎬' title={`Edit Movie`} subtitle={movie.title} />

      <MovieForm movieToEdit={movie} />
    </div>
  );
}
