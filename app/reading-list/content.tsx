'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import BookCard from '@/components/UI/Card/variants/Book';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { Separator } from '@/components/UI/Separator';
import { Book } from '@/types/book';

export function ReadingListSkeleton() {
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
      <section>
        <SectionTitle icon='eye' title='Currently Reading' loading={true} />
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <CardLoading variant='book' />
          <CardLoading variant='book' />
        </div>
      </section>
    </div>
  );
}

export default function ReadingListContent({ books }: { books: Book[] }) {
  const booksArray = books || [];

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
            {booksArray.filter((book) => book.type === 'currentlyReading')
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
            {booksArray.filter((book) => book.type === 'read').length > 0 ? (
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
            {booksArray.filter((book) => book.type === 'toRead').length > 0 ? (
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
