import { Metadata } from 'next';

import MoviesContent from './content';

export const metadata: Metadata = {
  title: 'Movies',
  description: 'Manage movies list',
};

export default async function MoviesPage() {
  return <MoviesContent />;
}
