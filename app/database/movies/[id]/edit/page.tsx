import { getMovieById } from '@/database/movies';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditMoviePage from './content';
import { Suspense } from 'react';

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
    <Suspense fallback={<div>Loading...</div>}>
      <MovieLoader params={params} />
    </Suspense>
  );
}
