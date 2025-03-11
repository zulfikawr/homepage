'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Label, Icon } from '@/components/UI';
import PostCard from '@/components/Card/Post';
import { useTitle } from '@/contexts/titleContext';
import { Post } from '@/types/post';

interface CategoryContentProps {
  posts: Post[];
  category: string;
}

export default function CategoryContent({
  posts,
  category,
}: CategoryContentProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (category) {
      setHeaderTitle(`Category: ${category}`);
    }
    return () => {
      setHeaderTitle('Zulfikar');
    };
  }, [setHeaderTitle, category]);

  return (
    <div>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-12 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 w-fit font-medium tracking-wide text-black dark:text-white'>
              {category && (
                <Label type='primary' icon='folder' className='mr-2'>
                  {category}
                </Label>
              )}
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
              <Link
                href='/post/cate'
                className='flex items-center text-sm lg:text-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <span className='mr-2 h-6 w-6'>
                  <Icon name='arrowLeft' />
                </span>
                Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 lg:rounded-xl lg:border lg:border-gray-200 lg:p-6 lg:shadow-sm dark:lg:border-gray-700'>
        {posts.length === 0 ? (
          <div className='flex flex-col items-center justify-center space-y-6 py-12'>
            <p className='text-xl font-medium text-gray-700 dark:text-gray-200'>
              No posts found in {category}
            </p>
            <div className='flex justify-center space-x-4'>
              <Link
                href='/post/cate'
                className='rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90'
              >
                View All Categories
              </Link>
              <Link
                href='/'
                className='rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700'
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className='mt-6'>
            <PostCard posts={posts} />
          </div>
        )}
      </div>
    </div>
  );
}
