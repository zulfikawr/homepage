import { Icon } from '~/components/UI';
import { Post } from '~/types/post';
import { getTimeAgo } from '~/utilities/timeAgo';

export default function CardFooter({ item }: { item: Post }) {
  const doShare = async () => {
    try {
      await navigator.share({
        title: item.title,
        url: `${window.location.origin}/post/${item.slug}`,
      });
    } catch (err) {
      console.error('Failed to share:', err.message);
    }
  };

  return (
    <div className='h-auto w-full items-center rounded-bl-md rounded-br-md border-t border-gray-100 px-5 py-3 dark:border-gray-700 lg:py-2'>
      <p className='leading-2 flex items-center justify-between whitespace-nowrap text-5 tracking-wide text-gray-500 dark:text-gray-400 lg:text-4 lg:leading-8'>
        <span className='flex items-center gap-x-2'>
          <span>Posted {getTimeAgo(item.date)}</span>
        </span>
        <span className='flex items-center'>
          <button
            className='effect-pressing flex items-center gap-x-2 hover:text-gray-600 dark:hover:text-gray-300'
            onClick={doShare}
          >
            <div className='size-5'>
              <Icon name='share' />
            </div>
            Share
          </button>
        </span>
      </p>
    </div>
  );
}
