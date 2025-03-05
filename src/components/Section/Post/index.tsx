import Link from 'next/link';
import { Icon } from '~/components/UI';
import { getPosts } from '~/functions/posts';
import PostCard from '~/components/Card/Post';
import { useAuth } from '~/contexts/authContext';
import { useFetchData } from '~/lib/fetchData';
import { sortByDate } from '~/utilities/sortByDate';
import PostsDrawer from './drawer';
import { drawer } from '~/components/Drawer';

const PostSection = () => {
  const { user } = useAuth();
  const { data: posts, loading, error } = useFetchData(getPosts);

  const sortedPosts = posts ? sortByDate(posts) : [];

  const handleOpenPostsDrawer = () => {
    drawer.open(<PostsDrawer posts={sortedPosts} />);
  };

  if (error) return <div>Failed to load posts</div>;
  if (loading) return;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <div
          onClick={user ? handleOpenPostsDrawer : undefined}
          className={`inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm ${
            user ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : ''
          } dark:border-gray-600 dark:bg-gray-700`}
        >
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='package' />
          </span>
          <span className='block uppercase'>Latest Posts</span>
        </div>
        <Link
          href='/posts'
          target='_blank'
          className='flex items-center gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        >
          All Posts
          <span className='h-5 w-5'>
            <Icon name='arrowSquareOut' />
          </span>
        </Link>
      </div>
      <div className='mt-5 flex flex-col'>
        {sortedPosts.slice(0, 5).map((post) => (
          <PostCard key={post.id} posts={[post]} />
        ))}
      </div>
    </section>
  );
};

export default PostSection;
