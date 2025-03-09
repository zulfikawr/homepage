// app/categories/categories-content.tsx
'use client';

import { Icon, Label } from '@/components/UI';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTitle } from '@/contexts/titleContext';

interface CategoryData {
  name: string;
  count: number;
}

interface Props {
  categories: CategoryData[];
}

export default function CategoriesContent({ categories }: Props) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle('Categories');
    return () => {
      setHeaderTitle('Zulfikar');
    };
  }, [setHeaderTitle]);

  return (
    <div>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>📁</span>
              Categories
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
              <Link
                href='/'
                className='text-sm lg:text-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center'
              >
                <span className='mr-2 size-[16px]'>
                  <Icon name='houseLine' />
                </span>
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white p-5 dark:border-gray-800 dark:bg-gray-800 lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'>
        {categories.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-gray-500 dark:text-gray-400'>
              No categories found.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {categories.map((category) => (
              <Link
                href={`/post/cate/${category.name}`}
                key={category.name}
                className='transform transition-transform hover:scale-105'
              >
                <div className='flex flex-col rounded-lg border p-6 shadow-sm hover:shadow-md dark:border-gray-700 bg-white dark:bg-gray-800'>
                  <Label type='primary' icon='folder' className='self-start'>
                    {category.name}
                  </Label>
                  <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                    {category.count} {category.count === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
