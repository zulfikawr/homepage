'use client';

import React from 'react';
import PageTitle from '@/components/PageTitle';
import ProjectForm from '@/components/Form/Project';

export default function NewProjectContent() {
  return (
    <div>
      <PageTitle
        emoji='🚀'
        title='Add Project'
        subtitle='Fill out the form below to add a new project'
      />

      <ProjectForm />
    </div>
  );
}
