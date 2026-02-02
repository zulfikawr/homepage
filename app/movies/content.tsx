'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import MovieCard from '@/components/UI/Card/variants/Movie';
import { useCollection } from '@/hooks';
import { mapRecordToMovie } from '@/lib/mappers';
import { Movie } from '@/types/movie';

export default function MoviesContent() {
  const {
    data: movies,
    loading,
    error,
  } = useCollection<Movie>('movies', mapRecordToMovie);

  if (error) return <CardEmpty message='Failed to load movies' />;

  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='My movie list' />

      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} variant='movie' />)
        ) : movies && movies.length > 0 ? (
          <StaggerContainer>
            {movies.map((movie) => (
              <ViewTransition key={movie.id}>
                <MovieCard movie={movie} />
              </ViewTransition>
            ))}
          </StaggerContainer>
        ) : (
          <CardEmpty message='No movies available' />
        )}
      </div>
    </div>
  );
}
