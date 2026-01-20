import { getBookById } from '@/database/books';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import EditBookPage from './content';
import { Suspense } from 'react';

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  return {
    title: book ? `Edit ${book.title}` : 'Edit Book',
  };
}

export default function BookEditPage({ params }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookLoader params={params} />
    </Suspense>
  );
}
