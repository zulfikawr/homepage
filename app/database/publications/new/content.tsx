'use client';

import PublicationForm from '@/components/form/publication';
import PageTitle from '@/components/page-title';

export default function NewPublicationContent() {
  return (
    <div>
      <PageTitle
        emoji='📚'
        title='Add Publication'
        subtitle='Fill out the form below to add a new pubication'
      />

      <PublicationForm />
    </div>
  );
}
