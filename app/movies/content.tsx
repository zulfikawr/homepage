'use client';

import { moviesData } from '@/database/movies.client';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import MovieCard from '@/components/Card/Movie';
import { useRealtimeData } from '@/hooks';
import { Movie } from '@/types/movie';

interface MoviesContentProps {
  initialData?: Movie[];
}

export default function MoviesContent({ initialData }: MoviesContentProps) {
  const {
    data: movies,
    loading,
    error,
  } = useRealtimeData(moviesData, initialData);

  if (error) return <CardEmpty message='Failed to load movies' />;

  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='My movie list' />

      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {loading ? (
          Array(4)
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
