'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import PostForm from '@/components/Form/Post';
import Link from 'next/link';
import { Icon } from '@/components/UI';
import type { Post } from '@/types/post';
import { useTitle } from '@/contexts/titleContext';

interface ManagePostContentProps {
  post: Post | null;
  action: string;
}

const UnauthorizedState = () => (
  <div className='mx-auto w-full max-w-md rounded-md border bg-white dark:bg-neutral-700 py-6 text-center shadow-sm'>
    <p className='text-sm font-light tracking-wide text-neutral-500 dark:text-neutral-400'>
      Please login to manage posts.
    </p>
    <Link href='/' className='mt-4 inline-block text-blue-500 hover:underline'>
      Return to Home
    </Link>
  </div>
);

export default function ManagePostContent({
  post,
  action,
}: ManagePostContentProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (post?.title) {
      setHeaderTitle(post.title);
    }
    return () => {
      setHeaderTitle('✍️ Create Post');
    };
  }, [setHeaderTitle, post?.title]);

  const { user } = useAuth();
  const isEdit = action === 'edit';

  if (!user) {
    return <UnauthorizedState />;
  }

  return (
    <div>
      <section className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex flex-1 items-center'>
            <div className='mr-4.5 mt-1 flex -rotate-6 items-center'>
              <span className='text-[35px] drop-shadow-lg'>
                {isEdit ? '📝' : '✍️'}
              </span>
            </div>
            <div>
              <h2 className='flex items-center gap-x-1.5 whitespace-nowrap text-[28px] font-medium tracking-wide text-black dark:text-white'>
                {isEdit ? 'Edit Post' : 'Create Post'}{' '}
                <span className='rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs text-blue-500 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400'>
                  {isEdit ? 'Edit' : 'New'}
                </span>
              </h2>
              <p className='-mt-1 text-sm text-neutral-500 dark:text-neutral-400'>
                {isEdit
                  ? 'Update your existing post'
                  : 'Create and publish your thoughts, ideas, and stories'}
              </p>
            </div>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 pl-5 pr-2'>
              <Link
                href='/post'
                className='flex items-center text-sm lg:text-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              >
                <span className='mr-2 size-[16px]'>
                  <Icon name='arrowLeft' />
                </span>
                Back to Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className='my-5'>
        <hr className='dark:border-neutral-600' />
      </div>

      <section className='mb-28'>
        <div className='rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
          <PostForm postToEdit={post} isInDrawer={false} />
        </div>
      </section>
    </div>
  );
}
