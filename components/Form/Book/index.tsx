'use client';

import React, { useState, useMemo } from 'react';
import { Book } from '@/types/book';
import { Button, Dropdown, FormLabel, Icon, Input } from '@/components/UI';
import { BookCard } from '@/components/Card/Book';
import { addBook, updateBook, deleteBook } from '@/functions/books';
import { toast } from '@/components/Toast';
import { generateId } from '@/utilities/generateId';
import { modal } from '@/components/Modal';
import Separator from '@/components/UI/Separator';
import { formatDate } from '@/utilities/formatDate';
import DateSelect from '@/components/DateSelect';
import { useRouter } from 'next/navigation';

interface BookFormProps {
  bookToEdit?: Book;
}

const initialBookState: Book = {
  id: '',
  type: 'toRead',
  title: '',
  author: '',
  imageURL: '',
  link: '',
  dateAdded: '',
};

const BookForm: React.FC<BookFormProps> = ({ bookToEdit }) => {
  const [book, setBook] = useState<Book>(bookToEdit || initialBookState);

  const initialDate = useMemo(() => {
    const date = bookToEdit?.dateAdded
      ? new Date(bookToEdit.dateAdded)
      : new Date();
    return date;
  }, [bookToEdit]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const currentPreviewBook: Book = {
    id: book.id || 'preview',
    type: book.type || 'currentlyReading',
    title: book.title || 'Book Title',
    author: book.author || 'Book Author',
    imageURL: book.imageURL || '/images/placeholder-portrait.png',
    link: book.link || '#',
    dateAdded: book.dateAdded || formatDate(selectedDate),
  };

  const handleChange = (field: keyof Book, value: string | Book['type']) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    handleChange('dateAdded', formatDate(newDate));
  };

  const requiredBookFields: { key: keyof Book; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'dateAdded', label: 'Publication date' },
    { key: 'type', label: 'Type' },
    { key: 'imageURL', label: 'Image URL' },
    { key: 'link', label: 'Book link' },
  ];

  const validateForm = () => {
    for (const field of requiredBookFields) {
      const value = book[field.key];
      const isEmpty = typeof value === 'string' ? !value.trim() : !value;

      if (isEmpty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const bookData = {
      ...book,
      id: bookToEdit?.id || generateId(book.title),
      dateAdded: formatDate(selectedDate),
    };

    try {
      const result = bookToEdit
        ? await updateBook(bookData)
        : await addBook(bookData);

      if (result.success) {
        toast.success(
          bookToEdit
            ? 'Book updated successfully!'
            : 'Book added successfully!',
        );
        router.push('/database/books');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the book: ${error.message}`
          : 'An unknown error occurred while saving the book.',
      );
    }
  };

  const handleDelete = async () => {
    if (!bookToEdit) return;

    try {
      const result = await deleteBook(bookToEdit.id);

      if (result.success) {
        toast.success('Book deleted successfully!');
        router.push('/database/books');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the book: ${error.message}`
          : 'An unknown error occurred while deleting the book.',
      );
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-neutral-800 dark:text-neutral-300'>
          Are you sure you want to delete the following book? This action cannot
          be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <BookCard book={currentPreviewBook} isInForm />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            type='destructive'
            onClick={() => {
              handleDelete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  const typeOptions = [
    { key: 'currentlyReading', label: 'Currently Reading' },
    { key: 'read', label: 'Read' },
    { key: 'toRead', label: 'To Read' },
  ];

  const currentType = typeOptions.find((opt) => opt.key === book.type);

  return (
    <>
      <div className='space-y-6'>
        {/* Book Preview */}
        <div className='flex justify-center'>
          <BookCard book={currentPreviewBook} isInForm />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
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
            <FormLabel htmlFor='type' required>
              Type
            </FormLabel>
            <Dropdown
              trigger={
                <Button className='flex items-center justify-between w-full px-2 text-sm md:text-md text-black dark:text-white'>
                  {currentType?.label}
                  <Icon name='caretDown' className='size-3' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {typeOptions.map((option) => (
                  <div
                    key={option.key}
                    onClick={() => handleChange('type', option.key)}
                    className={`px-4 py-2 text-left text-sm rounded-md cursor-pointer transition-colors duration-300
                      ${
                        option.key === book.type
                          ? 'bg-neutral-100 dark:bg-neutral-700'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </Dropdown>
          </div>
          <div>
            <FormLabel htmlFor='dateAdded' required>
              Date Added
            </FormLabel>
            <DateSelect
              value={selectedDate}
              onChange={handleDateChange}
              mode='day-month-year'
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
        </form>
      </div>

      <Separator margin='5' />

      {bookToEdit ? (
        <div className='flex space-x-4'>
          <Button
            type='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            type='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          type='primary'
          icon='plus'
          onClick={handleSubmit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default BookForm;
