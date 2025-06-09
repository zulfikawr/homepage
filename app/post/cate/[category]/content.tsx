'use client';

import Link from 'next/link';
import PostCard from '@/components/Card/Post';
import { Post } from '@/types/post';
import PageTitle from '@/components/PageTitle';

interface CategoryContentProps {
  posts: Post[];
  category: string;
}

export default function CategoryContent({
  posts,
  category,
}: CategoryContentProps) {
  return (
    <div>
      <PageTitle
        emoji='📁'
        title={`${category}`}
        subtitle='Posts organized by category'
        route={`/post/cate/${category}`}
      />

      {posts.length === 0 ? (
        <div className='flex flex-col items-center justify-center space-y-6 py-12'>
          <p className='text-xl font-medium text-neutral-700 dark:text-neutral-200'>
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
              className='rounded-md border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700'
            >
              Return to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className='mt-6 space-y-6'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
