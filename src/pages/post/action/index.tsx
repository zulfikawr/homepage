import React, { useEffect, useState } from 'react';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '~/pages/_app';
import { useAuth } from '~/contexts/authContext';
import PostForm from '~/components/Form/Post';
import Head from 'next/head';
import Link from 'next/link';
import { Icon } from '~/components/UI';
import { useRouter } from 'next/router';
import { getPostById } from '~/functions/posts';
import type { Post } from '~/types/post';

const ManagePost: NextPageWithLayout = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { action, id } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = action === 'edit';

  useEffect(() => {
    const fetchPost = async () => {
      if (isEdit && id) {
        setLoading(true);
        try {
          const postData = await getPostById(id as string);
          setPost(postData);
        } catch (err) {
          setError('Failed to load post');
          console.error('Error fetching post:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [isEdit, id]);

  if (!user) {
    return <div>Please login to manage posts</div>;
  }

  if (isEdit && loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (isEdit && !post) return <div>Post not found</div>;

  return (
    <div>
      <Head>
        <title>
          {isEdit ? `Edit Post - ${post?.title}` : 'Create Post'} - Zulfikar
        </title>
      </Head>
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
              <p className='-mt-1 text-sm text-neutral-500 dark:text-gray-400'>
                {isEdit
                  ? 'Update your existing post'
                  : 'Create and publish your thoughts, ideas, and stories'}
              </p>
            </div>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 pl-5 pr-2'>
              <p className='text-sm lg:text-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                <Link href='/posts' className='flex items-center'>
                  <span className='mr-2 size-[16px]'>
                    <Icon name='arrowLeft' />
                  </span>
                  Back to Posts
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className='my-5'>
        <hr className='dark:border-gray-600' />
      </div>

      <section className='mb-28'>
        <div className='rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <PostForm postToEdit={post} isInDrawer={false} />
        </div>
      </section>
    </div>
  );
};

ManagePost.layout = pageLayout;

export default ManagePost;
