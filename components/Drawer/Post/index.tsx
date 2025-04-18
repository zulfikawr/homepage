import { Post } from '@/types/post';
import { drawer } from '@/components/Drawer';
import PostForm from '@/components/Form/Post';
import { Button, Icon } from '@/components/UI';
import PostCard from '@/components/Card/Post';
import Separator from '@/components/UI/Separator';

const PostsDrawer = ({ posts }: { posts: Post[] }) => {
  const handleAddPost = () => {
    drawer.open(<PostForm isInDrawer />);
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='note' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Posts</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPost}>
              <span className='hidden lg:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {posts.map((post) => (
            <div key={post.id} className='cursor-pointer'>
              <PostCard key={post.id} post={post} isInDrawer />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostsDrawer;
