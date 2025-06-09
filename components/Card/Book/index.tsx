import { Book } from '@/types/book';
import openLink from '@/utilities/externalLink';
import { Card } from '@/components/Card';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: Book;
  openForm?: boolean;
  isInForm?: boolean;
}

export default function BookCard({ book, openForm, isInForm }: BookCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

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
      isInForm={isInForm}
      className={`${openForm ? 'w-full' : ''}`}
    >
      <div className='flex flex-1 items-center'>
        <div className='flex-shrink-0 px-4.5 py-4'>
          <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-neutral-200 dark:shadow-none dark:border-neutral-600'>
            <ImageWithFallback
              width={35}
              height={52}
              src={book.imageURL}
              alt={book.title}
              className='h-full w-full object-cover'
              loading='lazy'
              type='portrait'
            />
          </div>
        </div>
        <div className='py-2 pr-4 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {book.title}
          </p>
          <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-neutral-500 dark:text-neutral-400 lg:text-sm'>
            by {book.author}
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <span>Date Added</span>
        <span>{book.dateAdded}</span>
      </div>
    </Card>
  );
}

export { BookCard };
