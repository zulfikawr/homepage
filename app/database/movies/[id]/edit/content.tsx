'use client';

import { Movie } from '@/types/movie';
import PageTitle from '@/components/PageTitle';
import MovieForm from '@/components/Form/Movie';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

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
