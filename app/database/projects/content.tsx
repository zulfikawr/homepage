'use client';

import { useRouter } from 'next/navigation';

import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import ProjectCard from '@/components/Card/Project';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/UI';
import { useCollection } from '@/hooks';
import { mapRecordToProject } from '@/lib/mappers';
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
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='project' />)
        ) : (
          <>
            <ViewTransition>
              <div className='w-full rounded-md border bg-white text-center shadow-sm  dark:bg-card p-5'>
                <Button
                  type='primary'
                  icon='plus'
                  onClick={handleAddProject}
                  className='mx-auto'
                >
                  {projects && projects.length > 0 ? 'Add more' : 'Add project'}
                </Button>
              </div>
            </ViewTransition>

            {Array.isArray(projects) && projects.length > 0 ? (
              <StaggerContainer>
                {projects.map((project) => (
                  <ViewTransition key={project.id}>
                    <ProjectCard project={project} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <CardEmpty message='No projects available' />
            )}
          </>
        )}
      </div>
    </div>
  );
}
