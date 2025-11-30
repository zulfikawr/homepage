import { Metadata } from 'next';
import MoviesContent from './content';

export const metadata: Metadata = {
  title: 'Movies - Zulfikar',
  description: 'My movie list',
};

export default async function MoviesPage() {
  return <MoviesContent />;
}
