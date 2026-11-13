'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import CardEmpty from '@/components/ui/card/variants/empty';
import { MOVIE_TEMPLATE } from '@/components/ui/card/variants/loading';
import { Shimmer } from '@/components/ui/shimmer';
import MovieCard from '@/components/ui/card/variants/movie';
import { Movie } from '@/types/movie';

const MOVIE_TEMPLATES: Movie[] = Array.from({ length: 8 }, (_, index) => ({
  ...MOVIE_TEMPLATE,
  id: `loading-movie-${index}`,
  slug: `loading-movie-${index}`,
}));

export function MoviesSkeleton() {
  return (
    <Shimmer loading>
      <MoviesContent movies={MOVIE_TEMPLATES} />
    </Shimmer>
  );
}

export default function MoviesContent({ movies }: { movies: Movie[] }) {
  return (
    <div>
      <PageTitle emoji='🎬' title='Movies' subtitle='My movie list' />

      <div className='grid grid-cols-4 md:grid-cols-5 gap-4'>
        {movies && movies.length > 0 ? (
          <StaggerContainer>
            {movies.map((movie, index) => (
              <ViewTransition key={movie.id}>
                <MovieCard movie={movie} priority={index === 0} />
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
