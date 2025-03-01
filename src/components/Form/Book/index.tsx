import React, { useState } from 'react';
import { Book } from '~/types/book';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { Button } from '~/components/UI';
import { BookCard } from '~/components/Card/Book';
import { addBook, updateBook, deleteBook } from '~/functions/books';
import { toast } from '~/components/Toast';

const BookForm = ({ bookToEdit }: { bookToEdit?: Book }) => {
  const { user } = useAuth();

  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [author, setAuthor] = useState(bookToEdit?.author || '');
  const [imageURL, setImageURL] = useState(bookToEdit?.imageURL || '');
  const [link, setLink] = useState(bookToEdit?.link || '');
  const [type, setType] = useState(bookToEdit?.type || 'toRead');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const bookData = {
      id: bookToEdit?.id || Date.now().toString(),
      type,
      title,
      author,
      imageURL: imageURL || '/images/books/default.jpg',
      link,
      dateAdded:
        bookToEdit?.dateAdded || new Date().toISOString().split('T')[0],
    };

    try {
      let result;
      if (bookToEdit) {
        result = await updateBook(bookData);
      } else {
        result = await addBook(bookData);
      }

      if (result.success) {
        drawer.close();
        toast.show(
          bookToEdit
            ? 'Book updated successfully!'
            : 'Book added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save book');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error saving project: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while saving the book.');
      }
    }
  };

  const handleDelete = async () => {
    if (!bookToEdit || !user) return;

    try {
      const result = await deleteBook(bookToEdit.id);

      if (result.success) {
        drawer.close();
        toast.show('Book deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete book');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error deleting project: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while deleting the book.');
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {bookToEdit ? 'Edit Book' : 'Add New Book'}
          </h1>
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Book Preview */}
          <div className='flex justify-center'>
            <BookCard
              id='preview'
              type={type}
              title={title || 'Book Title'}
              author={author || 'Book Author'}
              imageURL={imageURL || '/images/books/default.jpg'}
              link={link || '#'}
              dateAdded={
                bookToEdit?.dateAdded || new Date().toISOString().split('T')[0]
              }
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Author</label>
              <input
                type='text'
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Image URL
              </label>
              <input
                type='text'
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Link</label>
              <input
                type='text'
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>Type</label>
              <select
                value={type}
                onChange={(e) =>
                  setType(
                    e.target.value as 'currentlyReading' | 'read' | 'toRead',
                  )
                }
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              >
                <option value='currentlyReading'>Currently Reading</option>
                <option value='read'>Read</option>
                <option value='toRead'>To Read</option>
              </select>
            </div>
            <div className='flex justify-end space-x-4'>
              {bookToEdit && handleDelete && (
                <Button type='destructive' onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button type='primary' onClick={handleSubmit}>
                {bookToEdit ? 'Save Changes' : 'Add Book'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookForm;
