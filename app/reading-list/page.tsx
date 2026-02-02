import { Suspense } from 'react';
import { Metadata } from 'next';

import { getBooks } from '@/lib/data';

import ReadingListContent, { ReadingListSkeleton } from './content';

export const metadata: Metadata = {
  title: 'Reading List - Zulfikar',
  description: 'Books and articles I am currently reading or have read',
};

async function ReadingList() {
  const books = await getBooks();
  return <ReadingListContent books={books} />;
}

export default function ReadingListPage() {
  return (
    <Suspense fallback={<ReadingListSkeleton />}>
      <ReadingList />
    </Suspense>
  );
}
