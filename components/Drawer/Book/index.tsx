import { BookCard } from '@/components/Card/Book';
import { Book } from '@/types/book';
import { drawer } from '@/components/Drawer';
import BookForm from '@/components/Form/Book';
import { Button } from '@/components/UI';

const BookDrawer = ({
  books,
  onUpdate,
}: {
  books: Book[];
  onUpdate: () => Promise<void>;
}) => {
  const handleEditBook = (book: Book) => {
    drawer.open(<BookForm bookToEdit={book} onUpdate={onUpdate} />);
  };

  const handleAddPodcast = () => {
    drawer.open(<BookForm onUpdate={onUpdate} />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Podcasts</h1>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPodcast}>
              <span className='hidden lg:block'>Add Podcast</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-3 overflow-y-auto w-fit p-4'>
        {books.map((book, index) => (
          <div
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditBook(book);
            }}
            className='cursor-pointer'
          >
            <BookCard {...book} isInDrawer />
          </div>
        ))}
      </div>
    </>
  );
};

export default BookDrawer;
