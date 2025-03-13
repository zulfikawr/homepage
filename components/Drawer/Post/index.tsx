import { Post } from '@/types/post';
import { drawer } from '@/components/Drawer';
import PostForm from '@/components/Form/Post';
import { Button } from '@/components/UI';
import PostCard from '@/components/Card/Post';

const PostsDrawer = ({ posts }: { posts: Post[] }) => {
  const handleAddPost = () => {
    drawer.open(<PostForm isInDrawer />);
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Posts</h1>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPost}>
              <span className='hidden lg:block'>Add Post</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {posts.map((post) => (
            <div key={post.id} className='cursor-pointer'>
              <PostCard key={post.id} posts={[post]} isInDrawer />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostsDrawer;
