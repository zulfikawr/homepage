'use client';

import ProjectForm from '@/components/Form/Project';
import PageTitle from '@/components/PageTitle';

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
