'use client';

import Link from 'next/link';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Label } from '@/components/UI';

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
      />

      <div className='bg-white p-5 dark:border-border dark:bg-card lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'>
        {categories.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No categories found.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            <StaggerContainer>
              {categories.map((category) => (
                <ViewTransition key={category.name}>
                  <Link
                    href={`/post/cate/${category.name}`}
                    className='transform transition-transform hover:scale-105 block h-full'
                  >
                    <div className='flex flex-col h-full rounded-lg border p-6 shadow-sm hover:shadow-md dark:border-border bg-card'>
                      <Label
                        type='primary'
                        icon='folder'
                        className='self-start'
                      >
                        {category.name}
                      </Label>
                      <p className='mt-4 text-sm text-muted-foreground'>
                        {category.count}{' '}
                        {category.count === 1 ? 'post' : 'posts'}
                      </p>
                    </div>
                  </Link>
                </ViewTransition>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </div>
  );
}
