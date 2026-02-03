'use client';

import ProjectForm from '@/components/form/project';
import PageTitle from '@/components/page-title';

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
