'use client';

import React from 'react';
import ProjectCard from '@/components/Card/Project';
import { projectsData } from '@/functions/projects';
import PageTitle from '@/components/PageTitle';
import { CardLoading } from '@/components/Card/Loading';
import { useRealtimeData } from '@/hooks';
import CardEmpty from '@/components/Card/Empty';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function ProjectDatabase() {
  const router = useRouter();

  const { data: projects, loading, error } = useRealtimeData(projectsData);

  if (error) return <div>Failed to load projects</div>;

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
        ) : Array.isArray(projects) && projects.length > 0 ? (
          <>
            <div className='w-full rounded-md border bg-white text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800 p-5'>
              <Button
                type='primary'
                icon='plus'
                onClick={handleAddProject}
                className='mx-auto'
              >
                Add more
              </Button>
            </div>

            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} openForm />
            ))}
          </>
        ) : (
          <CardEmpty message='No projects available' />
        )}
      </div>
    </div>
  );
}
