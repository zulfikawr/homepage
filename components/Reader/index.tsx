import PostContent from '@/components/PostContent';
import { drawer } from '@/components/Drawer';
import { Post } from '@/types/post';

interface ReaderProps {
  postData: Post;
}

export default function Reader({ postData }: ReaderProps) {
  return (
    <div className='h-full overflow-y-auto px-6 py-8 lg:px-20 lg:py-16'>
      <h1 className='text-1 font-medium leading-snug tracking-wider'>
        {postData.title}
      </h1>
      <p className='mb-16 mt-2 flex space-x-2 text-md tracking-wide text-neutral-500 dark:text-neutral-400'>
        <span>Posted {postData.dateString}</span>
      </p>
      <PostContent content={postData.content} />
    </div>
  );
}

export const openReader = (postData: Post) => {
  drawer.open(<Reader postData={postData} />);
};
