import { Metadata } from 'next';
import MoviesContent from './content';
import { getMovies } from '@/database/movies';

export const metadata: Metadata = {
  title: 'Movies - Zulfikar',
  description: 'A list of movies I have watched and recommend',
};

export default async function MoviesPage() {
  const movies = await getMovies();
  return <MoviesContent initialData={movies} />;
}
