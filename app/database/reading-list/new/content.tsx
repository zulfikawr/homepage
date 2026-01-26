'use client';

import BookForm from '@/components/Form/Book';
import PageTitle from '@/components/PageTitle';

export default function NewBookContent() {
  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Add Book'
        subtitle='Fill out the form below to add a new book'
      />

      <BookForm />
    </div>
  );
}
