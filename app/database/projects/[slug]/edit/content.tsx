'use client';

import { useEffect } from 'react';

import ProjectForm from '@/components/form/project';
import PageTitle from '@/components/page-title';
import { useTitle } from '@/contexts/title-context';
import { Project } from '@/types/project';

interface EditProjectPageProps {
  project: Project;
}

export default function EditProjectPage({ project }: EditProjectPageProps) {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle(`Edit: ${project.name}`);
    return () => setHeaderTitle('Projects');
  }, [project.name, setHeaderTitle]);

  return (
    <div>
      <PageTitle emoji='🚀' title='Edit Project' subtitle={project.name} />
      <ProjectForm projectToEdit={project} />
    </div>
  );
}
