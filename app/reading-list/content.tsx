'use client';

import React, { useState } from 'react';
import { BookCard } from '@/components/Card/Book';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import BookForm from '@/components/Form/Book';
import { Button } from '@/components/UI';
import { getBooks } from '@/functions/books';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import Separator from '@/components/UI/Separator';
import { CardLoading } from '@/components/Card/Loading';

export default function ReadingListContent() {
  const { user } = useAuth();
  const [isAdding] = useState(false);

  const { data: books, loading, error } = useFetchData(getBooks);

  const handleAddBookClick = () => {
    drawer.open(<BookForm />);
  };

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
      />

      {user && (
        <div className='mb-6 flex justify-end'>
          <Button
            type='primary'
            onClick={handleAddBookClick}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add Book'}
          </Button>
        </div>
      )}

      <section>
        <SectionTitle
          icon='eye'
          title='Currently Reading'
          iconClassName='text-green-500'
        />
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            {loading
              ? Array(2)
                  .fill(0)
                  .map((_, index) => <CardLoading key={index} type='book' />)
              : books
                  .filter((book) => book.type === 'currentlyReading')
                  .map((book) => <BookCard key={book.id} {...book} />)}
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <SectionTitle
          icon='checks'
          title='Read'
          iconClassName='text-yellow-500'
        />
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            {loading
              ? Array(2)
                  .fill(0)
                  .map((_, index) => <CardLoading key={index} type='book' />)
              : books
                  .filter((book) => book.type === 'read')
                  .map((book) => <BookCard key={book.id} {...book} />)}
          </div>
        </div>
      </section>

      <Separator />

      <section>
        <SectionTitle
          icon='bookmarks'
          title='To Read'
          iconClassName='text-blue-500'
        />
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            {loading
              ? Array(2)
                  .fill(0)
                  .map((_, index) => <CardLoading key={index} type='book' />)
              : books
                  .filter((book) => book.type === 'toRead')
                  .map((book) => <BookCard key={book.id} {...book} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
