import Image from 'next/image';
import { Book } from 'types/book';
import openLink from 'utilities/externalLink';
import { Button } from 'components/UI';
import { drawer } from 'components/Drawer';
import BookForm from 'components/Form/Book';
import { useAuth } from 'contexts/authContext';
import { Card } from 'components/Card';

export interface BookCardProps extends Book {
  isInDrawer?: boolean;
}

const BookCard = (props: BookCardProps) => {
  const { title, author, imageURL, link, dateAdded, isInDrawer } = props;
  const { user } = useAuth();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    drawer.open(<BookForm bookToEdit={props} />);
  };

  return (
    <Card
      onClick={() => {
        if (!isInDrawer) openLink(link);
      }}
      isInDrawer={isInDrawer}
    >
      <div className='flex flex-1 items-center lg:justify-center'>
        <div className='flex-shrink-0 px-4.5 py-4'>
          <Image
            width={35}
            height={52}
            src={imageURL}
            alt={title}
            className='rounded-sm border shadow-sm shadow-gray-200 dark:shadow-none'
            loading='lazy'
          />
        </div>
        <div className='py-2 pr-4 space-y-1'>
          <p className='lg:text-normal line-clamp-1 text-ellipsis text-sm font-medium leading-tight tracking-wider dark:text-white'>
            {title}
          </p>
          <p className='line-clamp-1 text-ellipsis whitespace-nowrap text-xs font-light tracking-wide text-gray-500 dark:text-gray-400 lg:text-sm'>
            by {author}
          </p>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-gray-100 px-4.5 py-2 text-xs font-light text-gray-500 dark:border-gray-700 dark:text-gray-400'>
        <span>Date Added</span>
        <span>{dateAdded}</span>
      </div>
      {user && !isInDrawer && (
        <div className='absolute top-2 right-2 hidden group-hover:flex'>
          <Button type='primary' onClick={handleEdit}>
            Edit
          </Button>
        </div>
      )}
    </Card>
  );
};

export { BookCard };
