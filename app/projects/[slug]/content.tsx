'use client';

import { useEffect } from 'react';

import { ViewTransition } from '@/components/motion';
import GitHubCard from '@/components/ui/card/variants/github';
import { PROJECT_TEMPLATE } from '@/components/ui/card/variants/loading';
import ProjectCard from '@/components/ui/card/variants/project';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { Separator } from '@/components/ui/separator';
import { Shimmer } from '@/components/ui/shimmer';
import { useTitle } from '@/contexts/title-context';
import { Project } from '@/types/project';

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

  const renderProject: Project = project || {
    ...PROJECT_TEMPLATE,
    readme:
      '## Overview\n\nA placeholder README used to measure the real project layout while the project data loads.\n\n## Stack\n\n- React\n- TypeScript\n- Tailwind CSS',
  };

  return (
    <Shimmer loading={isLoading || !project}>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        {/* Header */}
        <ViewTransition>
          <ProjectCard project={renderProject} isPreview />
        </ViewTransition>

        <Separator margin='6' />

        {/* Content */}
        <div className='space-y-8'>
          <ViewTransition>
            <section className='space-y-8'>
              {/* README */}
              {renderProject.readme && (
                <section>
                  <MarkdownRenderer
                    content={renderProject.readme}
                    className='max-w-none prose dark:prose-invert prose-headings:font-medium prose-a:text-primary'
                  />
                </section>
              )}

              <Separator margin='6' />

              {/* GitHub Card */}
              <ViewTransition>
                {renderProject.github_repo_url && (
                  <GitHubCard
                    repoUrl={renderProject.github_repo_url}
                    repoName={renderProject.name}
                  />
                )}
              </ViewTransition>
            </section>
          </ViewTransition>
        </div>
      </div>
    </Shimmer>
  );
};

export default ProjectContent;
