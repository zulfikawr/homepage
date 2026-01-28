'use client';

import { useEffect } from 'react';

import GitHubCard from '@/components/Card/GitHub';
import ProjectCard from '@/components/Card/Project';
import { ViewTransition } from '@/components/Motion';
import { Separator } from '@/components/UI/Separator';
import { useTitle } from '@/contexts/titleContext';
import { Project } from '@/types/project';
import { renderMarkdown } from '@/utilities/renderMarkdown';

const ProjectContent = ({
  project,
  isLoading,
}: {
  project?: Project;
  isLoading?: boolean;
}) => {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (project?.name) {
      setHeaderTitle(project.name);
    }
  }, [project?.name, setHeaderTitle]);

  if (isLoading || !project) {
    return (
      <div className='max-w-4xl mx-auto pt-24 lg:pt-20 px-4 pb-12 min-h-screen'>
        <div className='animate-pulse space-y-8'>
          <div className='h-8 bg-muted rounded w-1/3'></div>
          <div className='aspect-video w-full bg-muted rounded-xl'></div>
          <div className='h-4 bg-muted rounded w-3/4'></div>
          <div className='h-4 bg-muted rounded w-1/2'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
      {/* Header */}
      <ViewTransition>
        <ProjectCard project={project} isPreview />
      </ViewTransition>

      <Separator margin='6' />

      {/* Content */}
      <div className='space-y-8'>
        <ViewTransition>
          <section className='space-y-8'>
            {/* README */}
            {project.readme && (
              <section>
                <div
                  className='max-w-none prose dark:prose-invert prose-headings:font-medium prose-a:text-primary'
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(project.readme),
                  }}
                />
              </section>
            )}

            <Separator margin='6' />

            {/* GitHub Card */}
            <ViewTransition>
              {project.githubRepoUrl && (
                <GitHubCard
                  repoUrl={project.githubRepoUrl}
                  repoName={project.name}
                />
              )}
            </ViewTransition>
          </section>
        </ViewTransition>
      </div>
    </div>
  );
};

export default ProjectContent;
