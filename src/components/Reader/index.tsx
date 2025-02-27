import PostContent from '../PostContent';
import TimeAgo from 'react-timeago';
import { drawer } from '~/components/Drawer';
import { Post } from '~/constants/propTypes';

interface ReaderProps {
  postData: Post;
}

export default function Reader({ postData }: ReaderProps) {
  return (
    <div className='h-full overflow-y-auto px-6 py-8 md:px-20 md:py-16'>
      <h1 className='text-postTitle font-medium leading-snug tracking-wider'>
        {postData.title}
      </h1>
      <p className='mb-16 mt-2 flex space-x-2 text-xl tracking-wide text-gray-500 dark:text-gray-400'>
        <span>
          Posted <TimeAgo date={postData.date} />
        </span>
      </p>
      <PostContent content={postData.content} />
    </div>
  );
}

export const openReader = (postData: Post) => {
  drawer.open(<Reader postData={postData} />);
};
