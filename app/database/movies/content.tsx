'use client';

import MovieCard from '@/components/Card/Movie';
import { mapRecordToMovie } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { Movie } from '@/types/movie';
import { useLoadingToggle } from '@/contexts/loadingContext';

export default function MoviesContent() {
  const router = useRouter();
  const {
    data: movies,
    loading: dataLoading,
    error,
  } = useCollection<Movie>('movies', mapRecordToMovie);

  const { forceLoading } = useLoadingToggle();
  const loading = dataLoading || forceLoading;

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
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card flex items-center justify-center mx-auto min-h-[100px]'>
              <Button type='primary' icon='plus' onClick={handleAdd} />
            </div>

            {Array.isArray(movies) && movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} openForm />
              ))
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
