'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button, Card } from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import PostCard from '@/components/UI/Card/variants/Post';
import { useCollection } from '@/hooks';
import { mapRecordToPost } from '@/lib/mappers';
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
            .map((_, index) => <CardLoading key={index} variant='post' />)
        ) : (
          <>
            <ViewTransition>
              <Card isPreview>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddPost}
                  className='my-8 mx-auto'
                >
                  {posts && posts.length > 0 ? 'Add more' : 'Add post'}
                </Button>
              </Card>
            </ViewTransition>

            {Array.isArray(posts) && posts.length > 0 ? (
              <StaggerContainer>
                {posts.map((post) => (
                  <ViewTransition key={post.id}>
                    <PostCard post={post} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No posts available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
