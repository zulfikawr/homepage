'use client';

import PageTitle from '@/components/PageTitle';
import BookForm from '@/components/Form/Book';

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
