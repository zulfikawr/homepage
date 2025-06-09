'use client';

import { Book } from '@/types/book';
import PageTitle from '@/components/PageTitle';
import BookForm from '@/components/Form/Book';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

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
