'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, Card } from '@/components/ui';
import BookCard from '@/components/ui/card/variants/book';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import { useCollection } from '@/hooks';
import { mapRecordToBook } from '@/lib/mappers';
import { Book } from '@/types/book';

export default function ReadingListDatabase() {
  const router = useRouter();

  const {
    data: books,
    loading,
    error,
  } = useCollection<Book>('readingList', mapRecordToBook);

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
                <CardLoading key={index} variant='book' />
              ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <ViewTransition>
              <Card
                isPreview
                className='flex justify-center items-center h-full'
              >
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddBook}
                  className='mx-auto my-8'
                >
                  {books && books.length > 0 ? 'Add more' : 'Add book'}
                </Button>
              </Card>
            </ViewTransition>

            {Array.isArray(books) && books.length > 0 ? (
              <StaggerContainer>
                {books.map((book) => (
                  <ViewTransition key={book.id}>
                    <BookCard book={book} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
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
