import React, { useState } from 'react';
import { BookCard } from '~/components/Card/Book';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '~/pages/_app';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import BookForm from '~/components/Form/Book';
import useSWR from 'swr';
import fetcher from '~/lib/fetcher';
import { Book } from '~/types/book';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Icon } from '~/components/UI';

const ReadingList: NextPageWithLayout = () => {
  const { user } = useAuth();
  const { data, error } = useSWR('/api/reading-list', fetcher);
  const [isAdding, _setIsAdding] = useState(false);

  const handleAddBookClick = () => {
    drawer.open(<BookForm />);
  };

  if (error) return <div>Failed to load reading list</div>;
  if (!data) return <div>Loading...</div>;

  const { books }: { books: Book[] } = data;

  return (
    <div>
      <Head>
        <title>Reading List - Zulfikar</title>
        <meta name='description' content="Zulfikar's Reading List" />
      </Head>
      <section className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex flex-1 items-center'>
            <div className='mr-4.5 mt-1 flex -rotate-6 items-center'>
              <span className='text-[35px] drop-shadow-lg'>📚</span>
            </div>
            <div>
              <h2 className='flex items-center gap-x-1.5 whitespace-nowrap text-[28px] font-medium tracking-wide text-black dark:text-white'>
                Reading List{' '}
                <span className='rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-500 dark:border-yellow-700 dark:bg-yellow-800 dark:text-yellow-400'>
                  2024
                </span>
              </h2>
              <p className='-mt-1 text-sm text-neutral-500 dark:text-gray-400'>
                I{"'"}m reading or re-reading (on average) one book every month
                in 2024
              </p>
            </div>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 pl-5 pr-2'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 h-6 w-6'>
                    <Icon name='left' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className='my-5'>
        <hr className='dark:border-gray-600' />
      </div>
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
      <section className='mb-10'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 pb-1 pt-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-[22px] w-[22px] text-green-500'>
            <Icon name='eye' />
          </span>
          <span className='uppercase'>Currently Reading</span>
        </label>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            {books
              .filter((book) => book.type === 'currentlyReading')
              .map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
          </div>
        </div>
      </section>
      <div className='mb-10'>
        <hr className='dark:border-gray-600' />
      </div>
      <section className='mb-10'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 pb-1 pt-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-[22px] w-[22px] text-yellow-500'>
            <Icon name='checkDouble' />
          </span>
          <span className='uppercase'>Read</span>
        </label>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            {books
              .filter((book) => book.type === 'read')
              .map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
          </div>
        </div>
      </section>
      <div className='mb-10'>
        <hr className='dark:border-gray-600' />
      </div>
      <section className='mb-28'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 pb-1 pt-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5 text-blue-500'>
            <Icon name='bookmark' />
          </span>
          <span className='uppercase'>To Read</span>
        </label>
        <div className='mt-4'>
          <div className='grid grid-cols-2 gap-4'>
            {books
              .filter((book) => book.type === 'toRead')
              .map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

ReadingList.layout = pageLayout;

export default ReadingList;
