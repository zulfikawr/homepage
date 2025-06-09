import { Metadata } from 'next';
import NewBookContent from './content';

export const metadata: Metadata = {
  title: 'Add Book - Zulfikar',
  description: 'Add a new book',
};

export default function NewEmploymentPage() {
  return <NewBookContent />;
}
