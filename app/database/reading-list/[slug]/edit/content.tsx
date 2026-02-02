'use client';

import { useEffect } from 'react';

import BookForm from '@/components/Form/Book';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import { Book } from '@/types/book';

interface EditBookPageProps {
  book: Book;
}

export default function EditBookPage({ book }: EditBookPageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${book.title}`);
    return () => setHeaderTitle('Books');
  }, [book.title, setHeaderTitle]);

  return (
    <div>
      <PageTitle emoji='📚' title={`Edit Book`} subtitle={book.title} />

      <BookForm bookToEdit={book} />
    </div>
  );
}
