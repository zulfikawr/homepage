import { getBookById, getBooks } from '@/database/books';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditBookPage from './content';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function BookLoader({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) return notFound();

  return <EditBookPage book={book} />;
}

export async function generateStaticParams() {
  try {
    const books = await getBooks();
    return books.map((book) => ({
      id: book.id,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  return {
    title: book ? `Edit ${book.title}` : 'Edit Book',
  };
}

export default function BookEditPage({ params }: Props) {
  return <BookLoader params={params} />;
}
