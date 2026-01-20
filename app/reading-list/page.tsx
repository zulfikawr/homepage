import { Metadata } from 'next';
import ReadingListContent from './content';
import { getBooks } from '@/database/books';

export const metadata: Metadata = {
  title: 'Reading List - Zulfikar',
  description: 'Books and articles I am currently reading or have read',
};

export default async function ReadingListPage() {
  const books = await getBooks();
  return <ReadingListContent initialData={books} />;
}
