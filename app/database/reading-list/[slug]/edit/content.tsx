'use client';

import { useEffect } from 'react';

import BookForm from '@/components/form/book';
import PageTitle from '@/components/page-title';
import { useTitle } from '@/contexts/title-context';
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
