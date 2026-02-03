'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/DateSelect';
import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import {
  Button,
  Dropdown,
  DropdownItem,
  FormLabel,
  Icon,
  Input,
} from '@/components/UI';
import { BookCard } from '@/components/UI/Card/variants/Book';
import { Separator } from '@/components/UI/Separator';
import { addBook, deleteBook, updateBook } from '@/database/books';
import { Book } from '@/types/book';
import { formatDate } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface BookFormProps {
  book_to_edit?: Book;
}

const initial_book_state: Book = {
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

const BookForm: React.FC<BookFormProps> = ({ book_to_edit }) => {
  const [book, set_book] = useState<Book>(book_to_edit || initial_book_state);

  const [selected_date, set_selected_date] = useState<Date>(() => {
    if (book_to_edit?.date_added) {
      return new Date(book_to_edit.date_added);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!book_to_edit?.date_added) {
        set_selected_date(new Date());
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [book_to_edit?.date_added]);

  const current_preview_book: Book = {
    id: book.id || 'preview',
    slug: book.slug || 'preview',
    type: book.type || 'currently_reading',
    title: book.title || 'Book Title',
    author: book.author || 'Book Author',
    image: book.image_url,
    image_url: book.image_url || '/images/placeholder-portrait.png',
    link: book.link || '#',
    date_added: book.date_added || formatDate(selected_date),
  };

  const handle_change = (field: keyof Book, value: string | Book['type']) => {
    set_book((prev) => ({ ...prev, [field]: value }));
  };

  const handle_date_change = (new_date: Date) => {
    set_selected_date(new_date);
    handle_change('date_added', formatDate(new_date));
  };

  const required_book_fields: { key: keyof Book; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'date_added', label: 'Publication date' },
    { key: 'type', label: 'Type' },
    { key: 'image_url', label: 'Image URL' },
    { key: 'link', label: 'Book link' },
  ];

  const validate_form = () => {
    for (const field of required_book_fields) {
      const value = book[field.key];
      const is_empty = typeof value === 'string' ? !value.trim() : !value;

      if (is_empty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validate_form()) return;

    const book_data = {
      ...book,
      id: book_to_edit?.id || generateSlug(book.title),
      date_added: formatDate(selected_date),
    };

    try {
      const result = book_to_edit
        ? await updateBook(book_data)
        : await addBook(book_data);

      if (result.success) {
        toast.success(
          book_to_edit
            ? 'Book updated successfully!'
            : 'Book added successfully!',
        );
        router.push('/database/reading-list');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the book: ${error.message}`
          : 'An unknown error occurred while saving the book.',
      );
    }
  };

  const handle_delete = async () => {
    if (!book_to_edit) return;

    try {
      const result = await deleteBook(book_to_edit.id);

      if (result.success) {
        toast.success('Book deleted successfully!');
        router.push('/database/reading-list');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the book: ${error.message}`
          : 'An unknown error occurred while deleting the book.',
      );
    }
  };

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following book? This action cannot
          be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <BookCard book={current_preview_book} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              handle_delete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  const type_options = [
    { key: 'currently_reading', label: 'Currently Reading' },
    { key: 'read', label: 'Read' },
    { key: 'to_read', label: 'To Read' },
  ];

  const current_type = type_options.find((opt) => opt.key === book.type);

  return (
    <>
      <div className='space-y-6'>
        {/* Book Preview */}
        <div className='flex justify-center'>
          <BookCard book={current_preview_book} isPreview />
        </div>

        <Separator margin='5' />

        {/* Form */}
        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={book.title || ''}
              onChange={(e) => handle_change('title', e.target.value)}
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
              onChange={(e) => handle_change('author', e.target.value)}
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='type' required>
              Type
            </FormLabel>
            <Dropdown
              trigger={
                <Button className='flex items-center justify-between w-full px-2 text-sm md:text-md text-foreground'>
                  {current_type?.label}
                  <Icon name='caretDown' className='size-3' />
                </Button>
              }
              className='w-full'
              matchTriggerWidth
            >
              <div className='flex flex-col p-1 space-y-1 w-full'>
                {type_options.map((option) => (
                  <DropdownItem
                    key={option.key}
                    onClick={() =>
                      handle_change('type', option.key as Book['type'])
                    }
                    isActive={option.key === book.type}
                  >
                    {option.label}
                  </DropdownItem>
                ))}
              </div>
            </Dropdown>
          </div>
          <div>
            <FormLabel htmlFor='date_added' required>
              Date Added
            </FormLabel>
            <DateSelect
              value={selected_date}
              onChange={handle_date_change}
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
              onChange={(e) => handle_change('image_url', e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor='link' required>
              Book Link
            </FormLabel>
            <Input
              type='text'
              value={book.link || ''}
              onChange={(e) => handle_change('link', e.target.value)}
              required
            />
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {book_to_edit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirm_delete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handle_submit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handle_submit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default BookForm;
