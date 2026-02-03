'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import { ProjectCard } from '@/components/ui/card/variants/project';
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
