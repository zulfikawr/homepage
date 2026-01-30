import { useRouter } from 'next/navigation';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Book } from '@/types/book';
import openLink from '@/utilities/externalLink';

import { Card } from '../..';

interface BookCardProps {
  book: Book;
  openForm?: boolean;
  isPreview?: boolean;
  isActive?: boolean;
}

export default function BookCard({
  book,
  openForm,
  isPreview,
  isActive,
}: BookCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isPreview) return;

    if (openForm) {
      router.push(`/database/reading-list/${book.id}/edit`);
    } else {
      openLink(book.link);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      openForm={openForm}
      isPreview={isPreview}
      isActive={isActive}
      className={`${openForm ? 'w-full' : ''}`}
    >
      <div className='flex flex-1 items-center'>
        <div className='flex-shrink-0 px-4.5 py-4'>
          <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-muted dark:shadow-none '>
            <ImageWithFallback
              width={35}
              height={52}
              src={book.imageURL}
              alt={book.title}
              className='h-full w-full object-cover'
              loading='lazy'
              type='portrait'
              sizes='35px'
            />
          </div>
        </div>
        <div className='py-2 pr-4 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-foreground'>
            {book.title}
          </p>
          <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-muted-foreground lg:text-sm'>
            by {book.author}
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2 text-xs font-light text-muted-foreground  dark:text-muted-foreground'>
        <span>Date Added</span>
        <span>{book.dateAdded}</span>
      </div>
    </Card>
  );
}

export { BookCard };
