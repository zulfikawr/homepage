import { Metadata } from 'next';
import NewMovieContent from './content';

export const metadata: Metadata = {
  title: 'Add Movie - Zulfikar',
  description: 'Add a new movie to your list',
};

export default function NewMoviePage() {
  return <NewMovieContent />;
}
