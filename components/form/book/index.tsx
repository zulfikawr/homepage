'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/date-select';
import { modal } from '@/components/ui';
import { toast } from '@/components/ui';
import {
  Button,
  Dropdown,
  DropdownItem,
  FormLabel,
  Icon,
  Input,
} from '@/components/ui';
import { BookCard } from '@/components/ui/card/variants/book';
import { Separator } from '@/components/ui/separator';
import { Book } from '@/types/book';
import { formatDate } from '@/utilities/format-date';
import { generateSlug } from '@/utilities/generate-slug';

interface BookFormProps {
  bookToEdit?: Book;
}

const initialBookState: Book = {
  id: '',
  slug: '',
  type: 'to_read',
  title: '',
  author: '',
  image: '/images/placeholder.png',
  image_url: '',
  link: '',
  date_added: '',
};

const BookForm: React.FC<BookFormProps> = ({ bookToEdit }) => {
  const [book, setBook] = useState<Book>(bookToEdit || initialBookState);

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (bookToEdit?.date_added) {
      return new Date(bookToEdit.date_added);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!bookToEdit?.date_added) {
        const now = new Date();
        setSelectedDate(now);
        if (!book.date_added) {
          handleChange('date_added', formatDate(now));
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [bookToEdit?.date_added, book.date_added]);

  const currentPreviewBook: Book = {
    id: book.id || 'preview',
    slug: book.slug || 'preview',
    type: book.type || 'currently_reading',
    title: book.title || 'Book Title',
    author: book.author || 'Book Author',
    image: book.image_url,
    image_url: book.image_url || '/images/placeholder-portrait.png',
    link: book.link || '#',
    date_added: book.date_added || formatDate(selectedDate),
  };

  const handleChange = (field: keyof Book, value: string | Book['type']) => {
    setBook((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    handleChange('date_added', formatDate(newDate));
  };

  const requiredBookFields: { key: keyof Book; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'date_added', label: 'Publication date' },
    { key: 'type', label: 'Type' },
    { key: 'image_url', label: 'Image URL' },
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

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validateForm()) return;

    const bookData = {
      ...book,
      id: bookToEdit?.id || generateSlug(book.title),
      date_added: formatDate(selectedDate),
    };

    try {
      const response = await fetch('/api/collection/books', {
        method: bookToEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        toast.success(
          bookToEdit
            ? 'Book updated successfully!'
            : 'Book added successfully!',
        );
        router.push('/database/reading-list');
      } else {
        toast.error(result.error || 'Failed to save the book.');
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
      const response = await fetch(
        `/api/collection/books?id=${bookToEdit.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (result.success) {
        toast.success('Book deleted successfully!');
        router.push('/database/reading-list');
      } else {
        toast.error(result.error || 'Failed to delete the book.');
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
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following book? This action cannot
          be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <BookCard book={currentPreviewBook} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
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
    { key: 'currently_reading', label: 'Currently Reading' },
    { key: 'read', label: 'Read' },
    { key: 'to_read', label: 'To Read' },
  ];

  const currentType = typeOptions.find((opt) => opt.key === book.type);

  return (
    <>
      <div className='space-y-6'>
        {/* Book Preview */}
        <div className='flex justify-center'>
          <BookCard book={currentPreviewBook} isPreview />
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
              value={book.title || ''}
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
              value={book.author || ''}
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
                <Button className='w-full px-2 text-sm md:text-md text-foreground'>
                  {currentType?.label}
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              {typeOptions.map((option) => (
                <DropdownItem
                  key={option.key}
                  onClick={() =>
                    handleChange('type', option.key as Book['type'])
                  }
                  isActive={option.key === book.type}
                >
                  {option.label}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
          <div>
            <FormLabel htmlFor='date_added' required>
              Date Added
            </FormLabel>
            <DateSelect
              value={selectedDate}
              onChange={handleDateChange}
              mode='day-month-year'
            />
          </div>
          <div>
            <FormLabel htmlFor='image_url' required>
              Image URL
            </FormLabel>
            <Input
              type='text'
              value={book.image_url || ''}
              onChange={(e) => handleChange('image_url', e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor='link' required>
              Book Link
            </FormLabel>
            <Input
              type='text'
              value={book.link || ''}
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
            variant='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
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
