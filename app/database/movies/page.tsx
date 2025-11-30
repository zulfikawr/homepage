import { Metadata } from 'next';
import MoviesDatabase from './content';

export const metadata: Metadata = {
  title: 'Movies - Zulfikar',
  description: 'Manage movies list',
};

export default async function MoviesPage() {
  return <MoviesDatabase />;
}
