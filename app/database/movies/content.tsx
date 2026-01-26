'use client';

import { useRouter } from 'next/navigation';

import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import MovieCard from '@/components/Card/Movie';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/UI';
import { useCollection } from '@/hooks';
import { mapRecordToMovie } from '@/lib/mappers';
import { Movie } from '@/types/movie';

export default function MoviesContent() {
  const router = useRouter();
  const {
    data: movies,
    loading,
    error,
  } = useCollection<Movie>('movies', mapRecordToMovie);

  if (error) return <CardEmpty message='Failed to load movies' />;

  const handleAdd = () => {
    router.push('/database/movies/new');
  };

  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='Manage your movie list' />

      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='movie' />)
        ) : (
          <>
            <ViewTransition>
              <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card flex items-center justify-center mx-auto min-h-[100px]'>
                <Button type='primary' icon='plus' onClick={handleAdd} />
              </div>
            </ViewTransition>

            {Array.isArray(movies) && movies.length > 0 ? (
              <StaggerContainer>
                {movies.map((movie) => (
                  <ViewTransition key={movie.id}>
                    <MovieCard movie={movie} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <div className='col-span-3 md:col-span-4'>
                <CardEmpty message='No movies available' />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
