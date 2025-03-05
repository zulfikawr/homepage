import { Label } from '~/components/UI';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { contentLayout } from '~/components/Content';
import PostContent from '~/components/PostContent';
import type { NextPageWithLayout } from '~/pages/_app';
import { useTitle } from '~/contexts/titleContext';
import { Post } from '~/types/post';
import { getPostById } from '~/functions/posts';
import { getTimeAgo } from '~/utilities/timeAgo';

const BlogPost: NextPageWithLayout = () => {
  const router = useRouter();
  const { setHeaderTitle } = useTitle();
  const { pid } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!pid) return;

      try {
        const postData = await getPostById(pid as string);
        if (postData) {
          setPost(postData);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [pid]);

  useEffect(() => {
    if (!post) return;

    setHeaderTitle(post.title || '');
    return () => {
      setHeaderTitle('Zulfikar');
    };
  }, [setHeaderTitle, post]);

  if (loading) {
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
          {error}
        </p>
      </div>
    );
  }

  if (!post) {
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
        <title>{post.title}</title>
      </Head>
      <article className='bg-white p-5 pt-24 dark:border-gray-800 dark:bg-gray-800 lg:rounded-xl lg:border lg:p-20 lg:pt-20 lg:shadow-sm'>
        <div className='mb-20'>
          <div className='mb-3 flex'>
            {post.categories?.map((category) => (
              <Link href={`/post/cate/${category}`} key={category}>
                <Label type='primary' icon='cate'>
                  {category}
                </Label>
              </Link>
            ))}
          </div>
          <h1 className='text-1 font-medium leading-snug tracking-wider lg:text-postTitle'>
            {post.title}
          </h1>
          <p className='mt-2 flex space-x-2 whitespace-nowrap text-5 tracking-wide text-gray-500 lg:text-xl'>
            <span>Posted {getTimeAgo(post.date)}</span>
          </p>
        </div>
        <PostContent content={post.content || ''} />
      </article>
    </div>
  );
};

BlogPost.layout = contentLayout;

export default BlogPost;
