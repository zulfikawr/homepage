import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { FormSkeleton } from '@/components/Form/Loading';
import { getBookById } from '@/database/books';

import EditBookPage from './content';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function BookLoader({ params }: Props) {
  const { slug } = await params;
  const book = await getBookById(slug);

  if (!book) return notFound();

  return <EditBookPage book={book} />;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookById(slug);

  return {
    title: book ? `Edit ${book.title}` : 'Edit Book',
  };
}

export default function BookEditPage({ params }: Props) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <BookLoader params={params} />
    </Suspense>
  );
}
