'use client';

import { mapRecordToMovie } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import MovieCard from '@/components/Card/Movie';
import { useCollection } from '@/hooks';
import { Movie } from '@/types/movie';
import { useLoadingToggle } from '@/contexts/loadingContext';

export default function MoviesContent() {
  const {
    data: movies,
    loading: dataLoading,
    error,
  } = useCollection<Movie>('movies', mapRecordToMovie);

  const { forceLoading } = useLoadingToggle();
  const loading = dataLoading || forceLoading;

  if (error) return <CardEmpty message='Failed to load movies' />;

  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='My movie list' />

      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='movie' />)
        ) : movies && movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <CardEmpty message='No movies available' />
        )}
      </div>
    </div>
  );
}
