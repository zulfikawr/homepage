'use client';

import React, { useState, useMemo } from 'react';
import { Book } from 'types/book';
import { drawer } from 'components/Drawer';
import { Button, FormLabel, Input } from 'components/UI';
import { BookCard } from 'components/Card/Book';
import { addBook, updateBook, deleteBook } from 'functions/books';
import { toast } from 'components/Toast';
import { generateId } from '@/utilities/generateId';
import DatePicker from '@/components/DatePicker';

const initialBookState: Book = {
  id: '',
  type: 'toRead',
  title: '',
  author: '',
  imageURL: '',
  link: '',
  dateAdded: '',
};

const BookForm = ({ bookToEdit }: { bookToEdit?: Book }) => {
  const [book, setBook] = useState<Book>(bookToEdit || initialBookState);

  const selectedDate = useMemo(() => {
    return bookToEdit?.dateAdded ? new Date(bookToEdit.dateAdded) : new Date();
  }, [bookToEdit]);

  const handleChange = (field: keyof Book, value: string | Book['type']) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (dates: { start: Date; end: Date }) => {
    const newDate = dates.start;
    handleChange(
      'dateAdded',
      newDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookData = {
      ...book,
      id: bookToEdit?.id || generateId(book.title),
      dateAdded:
        bookToEdit?.dateAdded ||
        selectedDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    };

    try {
      const result = bookToEdit
        ? await updateBook(bookData)
        : await addBook(bookData);

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
      toast.show(
        error instanceof Error
          ? `Error saving book: ${error.message}`
          : 'An unknown error occurred while saving the book.',
      );
    }
  };

  const handleDelete = async () => {
    if (!bookToEdit) return;

    try {
      const result = await deleteBook(bookToEdit.id);

      if (result.success) {
        drawer.close();
        toast.show('Book deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete book');
      }
    } catch (error) {
      toast.show(
        error instanceof Error
          ? `Error deleting book: ${error.message}`
          : 'An unknown error occurred while deleting the book.',
      );
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
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Book Preview */}
          <div className='flex justify-center'>
            <BookCard
              id='preview'
              type={book.type}
              title={book.title || 'Book Title'}
              author={book.author || 'Book Author'}
              imageURL={book.imageURL || '/images/placeholder.png'}
              link={book.link || '#'}
              dateAdded={selectedDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <FormLabel htmlFor='type' required>
                Type
              </FormLabel>
              <select
                value={book.type}
                onChange={(e) =>
                  handleChange('type', e.target.value as Book['type'])
                }
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              >
                <option value='currentlyReading'>Currently Reading</option>
                <option value='read'>Read</option>
                <option value='toRead'>To Read</option>
              </select>
            </div>
            <div>
              <FormLabel htmlFor='title' required>
                Title
              </FormLabel>
              <Input
                type='text'
                value={book.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='author' required>
                Author
              </FormLabel>
              <Input
                type='text'
                value={book.author}
                onChange={(e) => handleChange('author', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='imageUrl' required>
                Image URL
              </FormLabel>
              <Input
                type='text'
                value={book.imageURL}
                onChange={(e) => handleChange('imageURL', e.target.value)}
              />
            </div>
            <div>
              <FormLabel htmlFor='link' required>
                Book Link
              </FormLabel>
              <Input
                type='text'
                value={book.link}
                onChange={(e) => handleChange('link', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='dateAdded' required>
                Date Added
              </FormLabel>
              <DatePicker
                value={{ start: selectedDate, end: selectedDate }}
                onChange={handleDateChange}
                isRange={false}
              />
            </div>
            <div className='flex justify-end space-x-4'>
              {bookToEdit && (
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
