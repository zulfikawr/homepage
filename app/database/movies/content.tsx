'use client';

import React from 'react';
import MovieCard from '@/components/Card/Movie';
import { moviesData } from '@/functions/movies';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function MoviesContent() {
  const router = useRouter();
  const { data: movies, loading, error } = useRealtimeData(moviesData);

  if (error) return <div>Failed to load movies</div>;

  const handleAdd = () => {
    router.push('/database/movies/new');
  };

  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='Manage your movie list' />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='certificate' />)
        ) : (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAdd}
                className='mx-auto'
              >
                Add more
              </Button>
            </div>

            {Array.isArray(movies) && movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} openForm />
              ))
            ) : (
              <CardEmpty message='No movies available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
