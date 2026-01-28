'use client';

import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import PostCard from '@/components/Card/Post';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import SectionTitle from '@/components/SectionTitle';
import { useCollection } from '@/hooks';
import { mapRecordToPost } from '@/lib/mappers';
import { Post } from '@/types/post';
import { sortByDate } from '@/utilities/sortByDate';

const PostSection = () => {
  const {
    data: posts,
    loading,
    error,
  } = useCollection<Post>('posts', mapRecordToPost);

  const sortedPosts = posts ? sortByDate(posts) : [];

  if (error) return <CardEmpty message='Failed to load posts' />;

  return (
    <section>
      <SectionTitle
        icon='notePencil'
        title='Latest Posts'
        loading={loading}
        link={{
          href: '/posts',
          label: 'All Posts',
        }}
      />
      {loading || !posts ? (
        <div className='flex flex-col gap-y-4'>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <CardLoading key={index} type='post' />
            ))}
        </div>
      ) : posts.length === 0 ? (
        <CardEmpty message='No posts found.' />
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          <StaggerContainer>
            {sortedPosts.map((post) => (
              <ViewTransition key={post.id}>
                <div key={post.id} className='cursor-pointer'>
                  <PostCard post={post} />
                </div>
              </ViewTransition>
            ))}
          </StaggerContainer>
        </div>
      )}
    </section>
  );
};

export default PostSection;
