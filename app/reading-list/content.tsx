'use client';

import React from 'react';
import { BookCard } from '@/components/Card/Book';
import { getBooks } from '@/functions/books';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import Separator from '@/components/UI/Separator';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';

export default function ReadingListContent() {
  const { data: books, loading, error } = useFetchData(getBooks);

  if (error) return <div>Failed to load reading list</div>;

  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Reading List'
        subtitle="I'm reading or re-reading (on average) one book every month in 2025"
        badge={{
          color: 'yellow',
          text: '2025',
        }}
        route='/reading-list'
      />

      {/* Currently Reading Section */}
      <section>
        <SectionTitle
          icon='eye'
          title='Currently Reading'
          iconClassName='text-green-500'
        />
        <div className='mt-4'>
          <div
            className={`grid ${books.filter((book) => book.type === 'currentlyReading').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {loading ? (
              Array(2)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='book' />)
            ) : books.filter((book) => book.type === 'currentlyReading')
                .length > 0 ? (
              books
                .filter((book) => book.type === 'currentlyReading')
                .map((book) => <BookCard key={book.id} {...book} />)
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
          iconClassName='text-yellow-500'
        />
        <div className='mt-4'>
          <div
            className={`grid ${books.filter((book) => book.type === 'read').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {loading ? (
              Array(2)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='book' />)
            ) : books.filter((book) => book.type === 'read').length > 0 ? (
              books
                .filter((book) => book.type === 'read')
                .map((book) => <BookCard key={book.id} {...book} />)
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
          iconClassName='text-blue-500'
        />
        <div className='mt-4'>
          <div
            className={`grid ${books.filter((book) => book.type === 'toRead').length === 0 ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}
          >
            {loading ? (
              Array(2)
                .fill(0)
                .map((_, index) => <CardLoading key={index} type='book' />)
            ) : books.filter((book) => book.type === 'toRead').length > 0 ? (
              books
                .filter((book) => book.type === 'toRead')
                .map((book) => <BookCard key={book.id} {...book} />)
            ) : (
              <CardEmpty message='No books to read yet' />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
