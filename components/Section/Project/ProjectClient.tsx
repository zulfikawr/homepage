'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import { ProjectCard } from '@/components/UI/Card/variants/Project';
import { Project } from '@/types/project';

export default function ProjectClient({ projects }: { projects: Project[] }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <StaggerContainer>
        {projects.map((project) => (
          <ViewTransition key={project.id}>
            <ProjectCard project={project} />
          </ViewTransition>
        ))}
      </StaggerContainer>
    </div>
  );
}
