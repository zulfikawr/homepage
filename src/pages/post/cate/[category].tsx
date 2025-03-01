import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { contentLayout } from '~/components/Content';
import type { NextPageWithLayout } from '~/pages/_app';
import { useTitle } from '~/contexts/titleContext';
import { getPosts } from '~/functions/posts';
import { Label, Icon } from '~/components/UI';
import PostCard from '~/components/Card/Post';
import { Post } from '~/types/post';

const CategoryPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { setHeaderTitle } = useTitle();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const categorySlug = router.query.category as string;

  useEffect(() => {
    if (categorySlug) {
      setHeaderTitle(`Category: ${categorySlug}`);
    }
    return () => {
      setHeaderTitle('Zulfikar');
    };
  }, [setHeaderTitle, categorySlug]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!router.isReady) return;

      try {
        setIsLoading(true);
        const allPosts = await getPosts();
        setPosts(allPosts);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch posts'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [router.isReady]);

  const filteredPosts = posts.filter((post) =>
    post.categories?.includes(categorySlug),
  );

  return (
    <div>
      <Head>
        <title>
          {categorySlug
            ? `${categorySlug} - Zulfikar`
            : 'Categories - Zulfikar'}
        </title>
        <meta
          name='description'
          content={`Posts in ${categorySlug} category`}
        />
      </Head>

      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 w-fit font-medium tracking-wide text-black dark:text-white'>
              {categorySlug && (
                <Label type='primary' icon='cate' className='mr-2'>
                  {categorySlug}
                </Label>
              )}
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
              <Link
                href='/cate'
                className='flex items-center text-xl text-gray-500 hover:text-primary dark:text-gray-400'
              >
                <span className='mr-2 h-6 w-6'>
                  <Icon name='left' />
                </span>
                Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 lg:rounded-xl lg:border lg:border-gray-200 lg:p-6 lg:shadow-sm dark:lg:border-gray-700'>
        {isLoading ? (
          <div className='flex justify-center py-10'>
            <div className='animate-pulse text-gray-500 dark:text-gray-400'>
              Loading posts...
            </div>
          </div>
        ) : error ? (
          <div className='rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
            <h1 className='text-lg font-medium'>Error</h1>
            <p className='text-gray-500 dark:text-gray-400'>
              Failed to load posts. Please try again.
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className='flex flex-col items-center justify-center space-y-6 py-12'>
            <p className='text-xl font-medium text-gray-700 dark:text-gray-200'>
              No posts found in {categorySlug}
            </p>
            <div className='flex justify-center space-x-4'>
              <Link
                href='/cate'
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
            <PostCard posts={filteredPosts} />
          </div>
        )}
      </div>
    </div>
  );
};

CategoryPage.layout = contentLayout;

export default CategoryPage;
