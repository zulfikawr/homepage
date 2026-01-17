'use client';

import PageTitle from '@/components/PageTitle';
import MovieForm from '@/components/Form/Movie';

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
