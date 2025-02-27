import useSWR from 'swr';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import { contentLayout } from '~/components/Content';
import type { NextPageWithLayout } from '~/pages/_app';
import { useTitle } from '~/contexts/titleContext';
import fetcher from '~/lib/fetcher';
import type { Post } from '~/constants/propTypes';
import { Icon, Label } from '~/components/UI';

const CategoriesPage: NextPageWithLayout = () => {
  const { setHeaderTitle } = useTitle();
  const { data, error } = useSWR<{ posts: Post[] }>('/api/posts', fetcher);

  // Set the page title
  useEffect(() => {
    setHeaderTitle('Categories');
    return () => {
      setHeaderTitle('Zulfikar');
    };
  }, [setHeaderTitle]);

  // Extract unique categories from all posts
  const categories = data?.posts
    ? [...new Set(data.posts.flatMap((post) => post.categories || []))]
    : [];

  // Count posts per category
  const categoryCount = categories.reduce(
    (acc, category) => {
      acc[category] =
        data?.posts.filter((post) => post.categories?.includes(category))
          .length || 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Handle loading state
  if (!data && !error) {
    return (
      <div className='mx-auto w-1/3 animate-pulse rounded-md border bg-white py-3 text-center shadow-sm'>
        <p className='text-sm font-light tracking-wide text-gray-500'>
          Loading categories...
        </p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className='mx-auto w-1/3 animate-pulse rounded-md border bg-white py-3 text-center shadow-sm'>
        <h1 className='text-lg font-medium'>Error</h1>
        <p className='text-sm font-light tracking-wide text-gray-500'>
          Failed to load categories. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Categories</title>
      </Head>
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
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 h-6 w-6'>
                    <Icon name='left' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white p-5 dark:border-gray-800 dark:bg-gray-800 lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'>
        {categories.length === 0 ? (
          <p className='text-gray-500'>No categories found.</p>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {categories.map((category) => (
              <Link
                href={`/cate/${category}`}
                key={category}
                className='transform transition-transform hover:scale-105'
              >
                <div className='flex flex-col rounded-lg border p-6 shadow-sm hover:shadow-md dark:border-gray-700'>
                  <Label type='primary' icon='cate' className='self-start'>
                    {category}
                  </Label>
                  <p className='mt-4 text-sm text-gray-500'>
                    {categoryCount[category]}{' '}
                    {categoryCount[category] === 1 ? 'post' : 'posts'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

CategoriesPage.layout = contentLayout;

export default CategoriesPage;
