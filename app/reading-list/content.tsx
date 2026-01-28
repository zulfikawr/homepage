'use client';

import BookCard from '@/components/Card/Book';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import { Separator } from '@/components/UI/Separator';
import { useCollection } from '@/hooks';
import { mapRecordToBook } from '@/lib/mappers';
import { Book } from '@/types/book';

interface ReadingListContentProps {
  initialData?: Book[];
}

export default function ReadingListContent({
  initialData,
}: ReadingListContentProps) {
  const {
    data: books,
    loading,
    error,
  } = useCollection<Book>('reading_list', mapRecordToBook, {}, initialData);

  const booksArray = books || [];

  if (error) return <CardEmpty message='Failed to load reading list' />;

  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Reading List'
        subtitle="I'm reading or re-reading (on average) one book every 3 month in 2025"
        badge={{
          color: 'yellow',
          text: '2025',
        }}
      />

      {/* Currently Reading Section */}
      <section>
        <SectionTitle
          icon='eye'
          title='Currently Reading'
          iconClassName='text-gruv-green'
        />
        <div className='mt-4'>
          <div
            className={`grid ${booksArray.filter((book) => book.type === 'currentlyReading').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='book' />)
            ) : booksArray.filter((book) => book.type === 'currentlyReading')
                .length > 0 ? (
              <StaggerContainer>
                {booksArray
                  .filter((book) => book.type === 'currentlyReading')
                  .map((book) => (
                    <ViewTransition key={book.id}>
                      <BookCard book={book} />
                    </ViewTransition>
                  ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No books currently being read' />
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Read Section */}
      <section>
        <SectionTitle
          icon='checks'
          title='Read'
          iconClassName='text-gruv-yellow'
        />
        <div className='mt-4'>
          <div
            className={`grid ${booksArray.filter((book) => book.type === 'read').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='book' />)
            ) : booksArray.filter((book) => book.type === 'read').length > 0 ? (
              <StaggerContainer>
                {booksArray
                  .filter((book) => book.type === 'read')
                  .map((book) => (
                    <ViewTransition key={book.id}>
                      <BookCard book={book} />
                    </ViewTransition>
                  ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No books read yet' />
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* To Read Section */}
      <section>
        <SectionTitle
          icon='bookmarks'
          title='To Read'
          iconClassName='text-gruv-blue'
        />
        <div className='mt-4'>
          <div
            className={`grid ${booksArray.filter((book) => book.type === 'toRead').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {loading ? (
              Array(8)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='book' />)
            ) : booksArray.filter((book) => book.type === 'toRead').length >
              0 ? (
              <StaggerContainer>
                {booksArray
                  .filter((book) => book.type === 'toRead')
                  .map((book) => (
                    <ViewTransition key={book.id}>
                      <BookCard book={book} />
                    </ViewTransition>
                  ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No books to read yet' />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
