'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Label } from '@/components/ui';
import { useCollection } from '@/hooks';
import { mapRecordToPost } from '@/lib/mappers';
import { Post } from '@/types/post';

export default function CategoriesContent() {
  const { data: posts } = useCollection<Post>('posts', mapRecordToPost);

  const categories = useMemo(() => {
    if (!posts) return [];
    const categoryMap = new Map<string, number>();

    posts.forEach((post) => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach((category) => {
          const currentCount = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCount + 1);
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [posts]);

  return (
    <div>
      <PageTitle
        emoji='📁'
        title='Categories'
        subtitle='Posts organized by category'
      />

      <div className='bg-white p-5  dark:bg-card lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'>
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
                    href={`/posts/cate/${category.name}`}
                    className='transform transition-transform hover:scale-105 block h-full'
                  >
                    <div className='flex flex-col h-full rounded-lg border p-6 shadow-sm hover:shadow-md  bg-card'>
                      <Label
                        variant='primary'
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
