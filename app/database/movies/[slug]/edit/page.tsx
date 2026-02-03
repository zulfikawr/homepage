import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/form/loading';
import { getMovieById } from '@/database/movies';

import EditMoviePage from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function MovieLoader({ params }: Props) {
  const { slug } = await params;
  const movie = await getMovieById(slug);

  if (!movie) return notFound();

  return <EditMoviePage movie={movie} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieById(slug);

  return {
    title: movie ? `Edit ${movie.title}` : 'Edit Movie',
  };
}

export default function MovieEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <MovieLoader params={params} />
    </Suspense>
  );
}
