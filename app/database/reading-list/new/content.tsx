'use client';

import BookForm from '@/components/form/book';
import PageTitle from '@/components/page-title';

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
