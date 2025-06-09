'use client';

import React from 'react';
import PageTitle from '@/components/PageTitle';
import EmploymentForm from '@/components/Form/Employment';

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
