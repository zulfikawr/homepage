import Link from 'next/link';
import { Icon, Button } from '~/components/UI';
import { getPosts } from '~/functions/posts';
import PostCard from '~/components/Card/Post';
import { useRouter } from 'next/router';
import { useAuth } from '~/contexts/authContext';
import { useFetchData } from '~/lib/fetchData';
import { sortByDate } from '~/utilities/sortByDate';

const PostSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data: posts, loading, error } = useFetchData(getPosts);

  const handleAddPost = () => {
    router.push('/post/create');
  };

  const sortedPosts = posts ? sortByDate(posts) : [];

  if (error) return <div>Failed to load posts</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='article' />
          </span>
          <span className='block uppercase'>Latest Posts</span>
        </label>
        <Link
          href='/posts'
          target='_blank'
          className='flex items-center gap-x-1 text-gray-500 underline-offset-4 hover:underline dark:text-gray-400'
        >
          All Posts
          <span className='h-5 w-5 underline'>
            <Icon name='externalLink' />
          </span>
        </Link>
      </div>
      <div className='mt-5 flex flex-col'>
        {sortedPosts.slice(0, 5).map((post) => (
          <PostCard key={post.id} posts={[post]} />
        ))}
      </div>

      {user && (
        <div className='mt-6 flex justify-center'>
          <Button
            type='primary'
            onClick={handleAddPost}
            className='flex items-center gap-2'
          >
            <span className='h-5 w-5'>
              <Icon name='plus' />
            </span>
            Add Post
          </Button>
        </div>
      )}
    </section>
  );
};

export default PostSection;
