'use client';

import MovieForm from '@/components/Form/Movie';
import PageTitle from '@/components/PageTitle';
import { Movie } from '@/types/movie';

interface EditMoviePageProps {
  movie: Movie;
}

export default function EditMoviePage({ movie }: EditMoviePageProps) {
  return (
    <div>
      <PageTitle
        emoji='🎬'
        title={`Edit: ${movie.title}`}
        subtitle={movie.title}
      />

      <MovieForm movieToEdit={movie} />
    </div>
  );
}
