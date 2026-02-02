'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import MovieCard from '@/components/UI/Card/variants/Movie';
import { Movie } from '@/types/movie';

export function MoviesSkeleton() {
  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='My movie list' />
      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <CardLoading key={index} variant='movie' />
          ))}
      </div>
    </div>
  );
}

export default function MoviesContent({ movies }: { movies: Movie[] }) {
  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='My movie list' />

      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {movies && movies.length > 0 ? (
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
