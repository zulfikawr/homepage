'use client';

import { useEffect } from 'react';
import PostCard from '@/components/Card/Post';
import { useTitle } from '@/contexts/titleContext';
import { getPosts } from '@/functions/posts';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';

export default function PostsContent() {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle('📰 Posts');
  });

  const { data: posts, loading, error } = useFetchData(getPosts);

  if (error) return <div>Failed to load posts</div>;

  return (
    <div>
      <PageTitle
        emoji='📰'
        title='Posts'
        subtitle='A collection of all my posts.'
      />

      {loading ? (
        <div className='flex flex-col gap-y-4'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <CardLoading key={index} type='post' />
            ))}
        </div>
      ) : posts.length === 0 ? (
        <CardEmpty message='No posts found.' />
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
