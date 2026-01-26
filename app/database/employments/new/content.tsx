'use client';

import EmploymentForm from '@/components/Form/Employment';
import PageTitle from '@/components/PageTitle';

export default function NewEmploymentContent() {
  return (
    <div>
      <PageTitle
        emoji='💼'
        title='Add Employment'
        subtitle='Fill out the form below to add a new employment'
      />

      <EmploymentForm />
    </div>
  );
}
