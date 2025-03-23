import Image from 'next/image';
import { Book } from '@/types/book';
import openLink from '@/utilities/externalLink';
import { Card } from '@/components/Card';

export interface BookCardProps extends Book {
  isInDrawer?: boolean;
}

const BookCard = (props: BookCardProps) => {
  const { title, author, imageURL, link, dateAdded, isInDrawer } = props;

  return (
    <Card
      onClick={() => {
        if (!isInDrawer) openLink(link);
      }}
      className={`${isInDrawer ? 'w-full' : ''}`}
    >
      <div className='flex flex-1 items-center'>
        <div className='flex-shrink-0 px-4.5 py-4'>
          <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-neutral-200 dark:shadow-none dark:border-neutral-600'>
            <Image
              width={35}
              height={52}
              src={imageURL}
              alt={title}
              className='h-full w-full object-cover'
              loading='lazy'
            />
          </div>
        </div>
        <div className='py-2 pr-4 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {title}
          </p>
          <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-neutral-500 dark:text-neutral-400 lg:text-sm'>
            by {author}
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <span>Date Added</span>
        <span>{dateAdded}</span>
      </div>
    </Card>
  );
};

export { BookCard };
