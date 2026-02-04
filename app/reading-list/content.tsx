'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import SectionTitle from '@/components/section-title';
import BookCard from '@/components/ui/card/variants/book';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import { Separator } from '@/components/ui/separator';
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
          iconClassName='text-theme-green'
        />
        <div className='mt-4'>
          <div
            className={`grid ${booksArray.filter((book) => book.type === 'currently_reading').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {booksArray.filter((book) => book.type === 'currently_reading')
              .length > 0 ? (
              <StaggerContainer>
                {booksArray
                  .filter((book) => book.type === 'currently_reading')
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
          iconClassName='text-theme-yellow'
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
          iconClassName='text-theme-blue'
        />
        <div className='mt-4'>
          <div
            className={`grid ${booksArray.filter((book) => book.type === 'to_read').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {booksArray.filter((book) => book.type === 'to_read').length > 0 ? (
              <StaggerContainer>
                {booksArray
                  .filter((book) => book.type === 'to_read')
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
