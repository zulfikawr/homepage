'use client';

import { useEffect } from 'react';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Badge, Button, Icon } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';
import { ViewTransition } from '@/components/Motion';
import { useTitle } from '@/contexts/titleContext';
import { Project } from '@/types/project';
import { renderMarkdown } from '@/utilities/renderMarkdown';
import GitHubCard from '@/components/Card/GitHub';

const ProjectContent = ({ project, isLoading }: { project?: Project, isLoading?: boolean }) => {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (project?.name) {
      setHeaderTitle(project.name);
    }
  }, [project?.name, setHeaderTitle]);

  const formatPeriod = () => {
    if (!project) return '';
    const ds = project.dateString || '';
    if (!ds) return '';
    if (ds.includes(' - ')) {
      const [start, end] = ds.split(' - ');
      if (end === 'Present') return `${start} - Present`;
      if (start === end) return start;
      return `${start} - ${end}`;
    }
    return ds;
  };

  if (isLoading || !project) {
    // Basic loading skeleton that matches the structure roughly
    return (
      <div className='max-w-4xl mx-auto pt-24 lg:pt-20 px-4 pb-12'>
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
    <div className='max-w-4xl mx-auto pt-24 lg:pt-20 px-4 pb-12'>
        {/* Header */}
        <ViewTransition>
        <div className='flex flex-col gap-4 mb-6'>
          <div className='flex flex-row justify-between items-start sm:items-center gap-4'>
            <div className='flex-1 flex items-center'>
              <h1 className='flex items-center text-3xl font-medium tracking-wide'>
                {project.favicon && (
                  <span className='mr-4 inline-block relative h-8 w-8'>
                    <ImageWithFallback
                      src={project.favicon}
                      alt={project.name}
                      fill
                      className='object-contain'
                      sizes='32px'
                    />
                  </span>
                )}
                {project.name}
              </h1>
            </div>
            {project.link && (
              <Button
                type='primary'
                icon='arrowSquareOut'
                onClick={() => window.open(project.link, '_blank')}
              >
                <span className='hidden sm:block'>Link</span>
              </Button>
            )}
          </div>
          
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground'>
             <span className='flex items-center gap-2'>
                <Icon name='calendar' className='h-4 w-4' />
                {formatPeriod()}
             </span>
             {/* We could add more metadata here if available */}
          </div>
        </div>
        </ViewTransition>

        <Separator margin='6' />

        {/* Content */}
        <div className='space-y-8'>
          {/* Image Section */}
          {/* <ViewTransition>
          <section>
            <div className='relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border border-border'>
              <ImageWithFallback
                src={project.image}
                alt={project.name}
                className='object-cover'
                fill
                sizes='(max-width: 1024px) 100vw, 1024px'
                preload
              />
            </div>
          </section>
          </ViewTransition> */}

          {/* GitHub Card */}
          <ViewTransition>
          {project.githubRepoUrl && (
            <GitHubCard
              repoUrl={project.githubRepoUrl}
              repoName={project.name}
            />
          )}
          </ViewTransition>

          <ViewTransition>
          <section className='space-y-8'>
             {/* README */}
             {project.readme && (
                 <section>
                 <h2 className='text-xl font-medium mb-3 flex items-center gap-2'>
                     <Icon name='mdFile' className='h-5 w-5' /> README.md
                 </h2>
                 <Separator margin='2' />
                 <div
                     className='max-w-none prose dark:prose-invert prose-headings:font-medium prose-a:text-primary'
                     dangerouslySetInnerHTML={{
                     __html: renderMarkdown(project.readme),
                     }}
                 />
                 </section>
             )}

             {/* Technologies at bottom */}
             <section>
                 <Separator margin='6' />
                 <h2 className='text-xl font-medium mb-4 flex items-center gap-2'>
                     <Icon name='stack' className='h-5 w-5' /> Technologies
                 </h2>
                 <div className='flex flex-wrap gap-2'>
                     {project.tools.map((tool, index) => (
                         <Badge key={index} icon>
                         {tool}
                         </Badge>
                     ))}
                 </div>
             </section>
          </section>
          </ViewTransition>
        </div>
    </div>
  );
};

export default ProjectContent;
