import { Metadata } from 'next';

import MoviesContent from './content';

export const metadata: Metadata = {
  title: 'Movies - Zulfikar',
  description: 'A list of movies I have watched and recommend',
};

export default async function MoviesPage() {
  return <MoviesContent />;
}
