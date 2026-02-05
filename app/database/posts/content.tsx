'use client';

import { useRouter } from 'next/navigation';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, Card } from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import PostCard from '@/components/ui/card/variants/post';
import { useCollection } from '@/hooks';
import { mapRecordToPost } from '@/lib/mappers';
import { Post } from '@/types/post';
import { sortByDate } from '@/utilities/sort-by-date';

export default function PostDatabase() {
  const router = useRouter();

  const {
    data: posts,
    loading,
    error,
  } = useCollection<Post>('posts', mapRecordToPost);

  if (error) return <CardEmpty message='Failed to load posts' />;

  const sortedPosts = posts ? sortByDate(posts) : [];

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
                  {sortedPosts.length > 0 ? 'Add more' : 'Add post'}
                </Button>
              </Card>
            </ViewTransition>

            {sortedPosts.length > 0 ? (
              <StaggerContainer>
                {sortedPosts.map((post) => (
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
