'use client';

import MovieForm from '@/components/Form/Movie';
import PageTitle from '@/components/PageTitle';

export default function NewMovieContent() {
  return (
    <div>
      <PageTitle
        emoji='🎬'
        title='Add Movie'
        subtitle='Fill out the form below to add a new movie'
      />

      <MovieForm />
    </div>
  );
}
