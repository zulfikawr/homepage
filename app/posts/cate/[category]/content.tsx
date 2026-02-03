'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import PostCard from '@/components/ui/card/variants/post';
import { useCollection } from '@/hooks';
import { mapRecordToPost } from '@/lib/mappers';
import { Post } from '@/types/post';

export default function CategoryContent({ category }: { category: string }) {
  const { data: allPosts } = useCollection<Post>('posts', mapRecordToPost);

  const posts = useMemo(() => {
    if (!allPosts) return [];
    return allPosts.filter((post) =>
      post.categories.some((c) => c.toLowerCase() === category.toLowerCase()),
    );
  }, [allPosts, category]);

  return (
    <div>
      <PageTitle
        emoji='📁'
        title={`${category}`}
        subtitle='Posts organized by category'
      />

      {posts.length === 0 ? (
        <div className='flex flex-col items-center justify-center space-y-6 py-12'>
          <p className='text-xl font-medium text-foreground'>
            No posts found in {category}
          </p>
          <div className='flex justify-center space-x-4'>
            <Link
              href='/posts/cate'
              className='rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90'
            >
              View All Categories
            </Link>
            <Link
              href='/'
              className='rounded-md border border-border px-4 py-2 text-sm hover:bg-muted  dark:hover:bg-neutral-700'
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className='mt-6 space-y-6'>
          <StaggerContainer>
            {posts.map((post) => (
              <ViewTransition key={post.id}>
                <PostCard post={post} />
              </ViewTransition>
            ))}
          </StaggerContainer>
        </div>
      )}
    </div>
  );
}
