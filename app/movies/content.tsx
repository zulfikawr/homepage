'use client';

import React from 'react';
import MovieCard from '@/components/Card/Movie';
import { moviesData } from '@/functions/movies';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';

export default function MoviesContent() {
  const { data: movies, loading, error } = useRealtimeData(moviesData);

  if (error) return <div>Failed to load movies</div>;

  return (
    <div>
      <PageTitle
        emoji='🎬'
        title='Movies'
        subtitle='My movie list'
        route='/movies'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='certificate' />)
        ) : movies && movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <CardEmpty message='No movies available' />
        )}
      </div>
    </div>
  );
}
