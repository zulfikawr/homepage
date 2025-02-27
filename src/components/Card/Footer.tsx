import { Icon } from '~/components/UI';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { Post } from '~/constants/propTypes';

export default function CardFooter({ item }: { item: Post }) {
  const [canShare, setCanShare] = useState<boolean | undefined>();

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

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  return (
    <div className='h-auto w-full items-center rounded-bl-md rounded-br-md border-t border-gray-100 px-5 py-3 dark:border-gray-700 lg:px-10 lg:py-2'>
      <p
        className={`leading-2 flex items-center justify-between whitespace-nowrap text-5 tracking-wide text-gray-500 dark:text-gray-400 lg:text-4 lg:leading-8 ${
          canShare === false ? 'animate-appear' : ''
        }`}
      >
        <span className='flex items-center gap-x-2'>
          <span>
            Posted <TimeAgo date={item.date} />
          </span>
        </span>
        {canShare && (
          <span className='flex items-center'>
            <button
              className='effect-pressing flex items-center gap-x-1 hover:text-gray-600 dark:hover:text-gray-300'
              onClick={doShare}
            >
              <span className='h-[15px] w-[15px]'>
                <Icon name='share' />
              </span>
              Share
            </button>
          </span>
        )}
      </p>
    </div>
  );
}
