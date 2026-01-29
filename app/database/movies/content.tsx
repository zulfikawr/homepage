'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import MovieCard from '@/components/UI/Card/variants/Movie';
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
            .map((_, index) => <CardLoading key={index} variant='movie' />)
        ) : (
          <>
            <ViewTransition>
              <div className='w-full rounded-md border bg-white text-center shadow-sm  dark:bg-card flex items-center justify-center mx-auto min-h-[100px]'>
                <Button variant='primary' icon='plus' onClick={handleAdd} />
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
