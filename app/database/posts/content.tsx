'use client';

import PostCard from '@/components/Card/Post';
import { mapRecordToPost } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';

export default function PostDatabase() {
  const router = useRouter();

  const {
    data: posts,
    loading,
    error,
  } = useCollection<Post>('posts', mapRecordToPost);

  if (error) return <CardEmpty message='Failed to load posts' />;

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
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='post' />)
        ) : (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddPost}
                className='mx-auto'
              >
                {posts && posts.length > 0 ? 'Add more' : 'Add post'}
              </Button>
            </div>

            {Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} openForm />
              ))
            ) : (
              <CardEmpty message='No posts available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
