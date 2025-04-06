'use client';

import PageTitle from '@/components/PageTitle';
import { Label } from '@/components/UI';
import Link from 'next/link';

interface CategoryData {
  name: string;
  count: number;
}

interface Props {
  categories: CategoryData[];
}

export default function CategoriesContent({ categories }: Props) {
  return (
    <div>
      <PageTitle
        emoji='📁'
        title='Categories'
        subtitle='Posts organized by category'
        route='/post/cate'
      />

      <div className='bg-white p-5 dark:border-neutral-800 dark:bg-neutral-800 lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'>
        {categories.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-neutral-500 dark:text-neutral-400'>
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
                <div className='flex flex-col rounded-lg border p-6 shadow-sm hover:shadow-md dark:border-neutral-700 bg-white dark:bg-neutral-800'>
                  <Label type='primary' icon='folder' className='self-start'>
                    {category.name}
                  </Label>
                  <p className='mt-4 text-sm text-neutral-500 dark:text-neutral-400'>
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
