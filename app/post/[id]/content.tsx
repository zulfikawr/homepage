'use client';

import { Label } from '@/components/UI';
import Link from 'next/link';
import PostContent from '@/components/PostContent';
import { useTitle } from '@/contexts/titleContext';
import { Post } from '@/types/post';
import { useEffect } from 'react';

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (post?.title) {
      setHeaderTitle(post.title);
    }
    return () => {
      setHeaderTitle('Posts - Zulfikar');
    };
  }, [setHeaderTitle, post?.title]);

  return (
    <article className='p-4 pt-24 lg:p-20 lg:pt-20'>
      <div className='mb-20'>
        <div className='mb-3 flex flex-wrap gap-2'>
          {post.categories?.map((category) => (
            <Link href={`/post/cate/${category}`} key={category}>
              <Label type='primary' icon='folder'>
                {category}
              </Label>
            </Link>
          ))}
        </div>
        <h1 className='text-1 lg:text-5xl font-medium leading-snug tracking-wider'>
          {post.title}
        </h1>
        <div className='mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'>
          <span className='flex items-center'>
            Posted {post.dateString ? post.dateString : 'recently'}
          </span>
        </div>
      </div>
      <PostContent content={post.content || ''} />
    </article>
  );
}
