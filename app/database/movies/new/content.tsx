'use client';

import MovieForm from '@/components/form/movie';
import PageTitle from '@/components/page-title';

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
