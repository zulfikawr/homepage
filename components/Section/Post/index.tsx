import { getPosts } from 'functions/posts';
import PostCard from 'components/Card/Post';
import CardEmpty from 'components/Card/Empty';
import { useAuth } from 'contexts/authContext';
import { useFetchData } from 'lib/fetchData';
import { sortByDate } from 'utilities/sortByDate';
import PostsDrawer from './drawer';
import { drawer } from 'components/Drawer';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';

const PostSection = () => {
  const { user } = useAuth();
  const { data: posts, loading, error } = useFetchData(getPosts);

  const sortedPosts = posts ? sortByDate(posts) : [];

  const handleOpenPostsDrawer = () => {
    drawer.open(<PostsDrawer posts={sortedPosts} />);
  };

  if (error) return <div>Failed to load posts</div>;

  return (
    <section>
      <SectionTitle
        icon='package'
        title='Latest Posts'
        link={{
          href: '/post',
          label: 'All Posts',
        }}
        onClick={handleOpenPostsDrawer}
        isClickable={!!user}
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
            <div key={post.id} className='cursor-pointer'>
              <PostCard key={post.id} posts={[post]} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default PostSection;
