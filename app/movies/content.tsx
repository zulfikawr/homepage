'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import MovieCard from '@/components/ui/card/variants/movie';
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
