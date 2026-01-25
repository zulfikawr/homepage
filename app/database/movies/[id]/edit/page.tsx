import { getMovieById } from '@/database/movies';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditMoviePage from './content';
import { Suspense } from 'react';
import { FormSkeleton } from '@/components/Form/Loading';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function MovieLoader({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) return notFound();

  return <EditMoviePage movie={movie} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieById(id);

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
