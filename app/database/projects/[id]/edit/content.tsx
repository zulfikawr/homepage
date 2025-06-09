'use client';

import { Project } from '@/types/project';
import PageTitle from '@/components/PageTitle';
import ProjectForm from '@/components/Form/Project';
import { useTitle } from '@/contexts/titleContext';
import { useEffect } from 'react';

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
