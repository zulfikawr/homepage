'use client';

import ProjectCard from '@/components/Card/Project';
import { mapRecordToProject } from '@/lib/mappers';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useCollection } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';

export default function ProjectsDatabase() {
  const router = useRouter();

  const {
    data: projects,
    loading,
    error,
  } = useCollection<Project>('projects', mapRecordToProject);

  if (error) return <CardEmpty message='Failed to load projects' />;

  const handleAddProject = () => {
    router.push('/database/projects/new');
  };

  return (
    <div>
      <PageTitle emoji='🚀' title='Projects' subtitle='Browse all projects' />

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='project' />)
        ) : (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-border dark:bg-card p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddProject}
                className='mx-auto'
              >
                {projects && projects.length > 0 ? 'Add more' : 'Add project'}
              </Button>
            </div>

            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project.id} project={project} openForm />
              ))
            ) : (
              <CardEmpty message='No projects available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
