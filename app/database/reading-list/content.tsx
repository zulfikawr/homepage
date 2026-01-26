'use client';

import BookCard from '@/components/Card/Book';
import { mapRecordToBook } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { Book } from '@/types/book';

export default function ReadingListDatabase() {
  const router = useRouter();

  const {
    data: books,
    loading,
    error,
  } = useCollection<Book>('reading_list', mapRecordToBook);

  if (error) return <CardEmpty message='Failed to load books' />;

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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <CardLoading key={index} type='book' />
              ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='w-full rounded-md border bg-white flex justify-center items-center text-center shadow-sm dark:border-border dark:bg-card p-5 min-h-[100px]'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddBook}
                className='mx-auto'
              >
                {books && books.length > 0 ? 'Add more' : 'Add book'}
              </Button>
            </div>

            {Array.isArray(books) && books.length > 0 ? (
              books.map((book) => (
                <BookCard key={book.id} book={book} openForm />
              ))
            ) : (
              <div className='md:col-span-1'>
                <CardEmpty message='No books available' />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
