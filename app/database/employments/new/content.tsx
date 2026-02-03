'use client';

import EmploymentForm from '@/components/form/employment';
import PageTitle from '@/components/page-title';

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
