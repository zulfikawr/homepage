import { BookCard } from '@/components/Card/Book';
import { Book } from '@/types/book';
import { drawer } from '@/components/Drawer';
import BookForm from '@/components/Form/Book';
import { Button, Icon } from '@/components/UI';
import Separator from '@/components/UI/Separator';

const BookDrawer = ({ books }: { books: Book[] }) => {
  const handleAddBook = () => {
    drawer.open(<BookForm />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='bookOpen' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Reading Lists</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddBook}>
              <span className='hidden lg:block'>Add</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='grid grid-cols-2 gap-4 overflow-y-auto w-fit p-4 md:p-8'>
        {books.map((book, index) => (
          <BookCard key={index} book={book} isInDrawer />
        ))}
      </div>
    </>
  );
};

export default BookDrawer;
