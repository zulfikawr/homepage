import { postsData } from '@/database/posts.client';
import PostCard from '@/components/Card/Post';
import CardEmpty from '@/components/Card/Empty';
import { sortByDate } from '@/utilities/sortByDate';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import { Post } from '@/types/post';

interface PostSectionProps {
  initialData?: Post[];
}

const PostSection = ({ initialData }: PostSectionProps) => {
  const {
    data: posts,
    loading,
    error,
  } = useRealtimeData(postsData, initialData);

  const sortedPosts = posts ? sortByDate(posts) : [];

  if (error) return <CardEmpty message='Failed to load posts' />;

  return (
    <section>
      <SectionTitle
        icon='notePencil'
        title='Latest Posts'
        loading={loading}
        link={{
          href: '/post',
          label: 'All Posts',
        }}
      />
      {loading || !posts ? (
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
          {sortedPosts.map((post) => (
            <div key={post.id} className='cursor-pointer'>
              <PostCard key={post.id} post={post} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PostSection;
