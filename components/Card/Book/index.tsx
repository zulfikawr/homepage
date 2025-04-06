import { Book } from '@/types/book';
import openLink from '@/utilities/externalLink';
import { Card } from '@/components/Card';
import BookForm from '@/components/Form/Book';
import { drawer } from '@/components/Drawer';
import ImageWithFallback from '@/components/ImageWithFallback';

interface BookCardProps {
  book: Book;
  isInDrawer?: boolean;
  isInForm?: boolean;
}

export default function BookCard({
  book,
  isInDrawer,
  isInForm,
}: BookCardProps) {
  const handleCardClick = () => {
    if (isInForm) return;

    if (isInDrawer) {
      drawer.open(<BookForm bookToEdit={book} />);
    } else openLink(book.link);
  };

  return (
    <Card
      onClick={handleCardClick}
      isInDrawer={isInDrawer}
      isInForm={isInForm}
      className={`${isInDrawer ? 'w-full' : ''}`}
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
