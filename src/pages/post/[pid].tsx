import useSWR from 'swr';
import { Label } from '~/components/UI';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { contentLayout } from '~/components/Content';
import PostContent from '~/components/PostContent';
import type { NextPageWithLayout } from '~/pages/_app';
import { useTitle } from '~/contexts/titleContext';
import fetcher from '~/lib/fetcher';
import type { Post } from '~/constants/propTypes';

const BlogPost: NextPageWithLayout = () => {
  const router = useRouter();
  const { setHeaderTitle } = useTitle();
  const { pid } = router.query;

  const { data, error } = useSWR<{ posts: Post[] }>('/api/posts', fetcher);
  const [isPostNotFound, setIsPostNotFound] = useState(false);

  const post = data?.posts?.find((p) => p.slug === pid);
  const title = post?.title || '';

  useEffect(() => {
    if (data && !post) {
      console.log('Post not found. Redirecting to 404...');
      setIsPostNotFound(true);
      router.replace('/404');
    }
  }, [data, post, router]);

  useEffect(() => {
    setHeaderTitle(title);
    return () => {
      setHeaderTitle('Zulfikar');
    };
  }, [setHeaderTitle, title]);

  if (!data && !error) {
    return (
      <div className='mx-auto w-1/3 animate-pulse rounded-md border bg-white py-3 text-center shadow-sm'>
        <p className='text-sm font-light tracking-wide text-gray-500'>
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mx-auto w-1/3 animate-pulse rounded-md border bg-white py-3 text-center shadow-sm'>
        <h1 className='text-lg font-medium'>Error</h1>
        <p className='text-sm font-light tracking-wide text-gray-500'>
          Failed to load post. Please try again.
        </p>
      </div>
    );
  }

  if (isPostNotFound) {
    return (
      <div className='mx-auto w-1/3 animate-pulse rounded-md border bg-white py-3 text-center shadow-sm'>
        <h1 className='text-lg font-medium'>404 Not Found</h1>
        <p className='text-sm font-light tracking-wide text-gray-500'>
          Post not found. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <article
        data-cy='postContent'
        className='bg-white p-5 pt-24 dark:border-gray-800 dark:bg-gray-800 lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'
      >
        <div className='mb-20'>
          <div className='mb-3 flex'>
            {post?.categories?.map((category) => (
              <Link href={`/cate/${category}`} key={category}>
                <Label type='primary' icon='cate'>
                  {category}
                </Label>
              </Link>
            ))}
          </div>
          <h1 className='text-1.5 font-medium leading-snug tracking-wider lg:text-postTitle'>
            {post?.title}
          </h1>
          <p className='mt-2 flex space-x-2 whitespace-nowrap text-5 tracking-wide text-gray-500 lg:text-xl'>
            <span>
              Posted <TimeAgo date={post?.date} />
            </span>
          </p>
        </div>
        <PostContent content={post?.content || ''} />
      </article>
    </div>
  );
};

BlogPost.layout = contentLayout;

export default BlogPost;
