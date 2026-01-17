'use client';

import React from 'react';
import BookCard from '@/components/Card/Book';
import { booksData } from '@/database/books';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function ReadingListDatabase() {
  const router = useRouter();

  const { data: books, loading, error } = useRealtimeData(booksData);

  if (error) return <div>Failed to load books</div>;

  const handleAddBook = () => {
    router.push('/database/reading-list/new');
  };

  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Reading List'
        subtitle='Books I’ve read or plan to read'
      />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='book' />)
        ) : Array.isArray(books) && books.length > 0 ? (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='w-full rounded-md border bg-white flex justify-center items-center text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-5'>
                <Button
                  type='primary'
                  icon='plus'
                  onClick={handleAddBook}
                  className='mx-auto'
                >
                  Add more
                </Button>
              </div>

              {books.map((book) => (
                <BookCard key={book.id} book={book} openForm />
              ))}
            </div>
          </>
        ) : (
          <CardEmpty message='No books available' />
        )}
      </div>
    </div>
  );
}
