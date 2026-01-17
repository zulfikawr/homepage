'use client';

import React from 'react';
import PostCard from '@/components/Card/Post';
import { postsData } from '@/database/posts';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function PostDatabase() {
  const router = useRouter();

  const { data: posts, loading, error } = useRealtimeData(postsData);

  if (error) return <div>Failed to load posts</div>;

  const handleAddPost = () => {
    router.push('/database/posts/new');
  };

  return (
    <div>
      <PageTitle
        emoji='📰'
        title='Posts'
        subtitle='Browse all posts on Zulfikar'
      />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='post' />)
        ) : Array.isArray(posts) && posts.length > 0 ? (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddPost}
                className='mx-auto'
              >
                Add more
              </Button>
            </div>

            {posts.map((post) => (
              <PostCard key={post.id} post={post} openForm />
            ))}
          </>
        ) : (
          <CardEmpty message='No posts available' />
        )}
      </div>
    </div>
  );
}
