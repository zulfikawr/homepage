'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button, Card } from '@/components/UI';
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
              <Card
                className='relative flex flex-col h-full'
                onClick={handleAdd}
              >
                <div className='aspect-[2/3] w-full bg-muted/30' />
                <div className='flex w-full items-center justify-center py-2'>
                  {/* Space to match stars height */}
                  <div className='h-[16px] md:h-[18px]' />
                </div>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Button
                    variant='primary'
                    icon='plus'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd();
                    }}
                  />
                </div>
              </Card>
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
