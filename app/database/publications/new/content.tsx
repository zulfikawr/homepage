'use client';

import PageTitle from '@/components/PageTitle';
import PublicationForm from '@/components/Form/Publication';

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
