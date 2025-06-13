import React from 'react';
import { Button, Badge } from '@/components/UI';
import { Project } from '@/types/project';
import { drawer } from '@/components/Drawer';
import Separator from '@/components/UI/Separator';
import ImageWithFallback from '@/components/ImageWithFallback';

const ProjectViewer = ({ project }: { project: Project }) => {
  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center gap-4'>
          <div className='flex-1 flex items-center'>
            <h1 className='flex items-center text-xl sm:text-2xl font-medium tracking-wide'>
              {project.favicon && (
                <span className='mr-3 inline-block'>
                  <ImageWithFallback
                    src={project.favicon}
                    alt={project.name}
                    height={30}
                    width={30}
                    type='square'
                  />
                </span>
              )}
              {project.name}
            </h1>
          </div>
          <div className='flex gap-4'>
            {project.link && (
              <Button
                type='primary'
                icon='arrowSquareOut'
                onClick={() => window.open(project.link, '_blank')}
              >
                <span className='hidden lg:block'>Link</span>
              </Button>
            )}
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-8 space-y-8'>
          {/* Image Section */}
          <section>
            <div className='relative aspect-video w-full rounded-xl overflow-hidden'>
              <ImageWithFallback
                src={project.image}
                alt={project.name}
                className='object-cover'
                fill
              />
            </div>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-medium mb-4'>
              Description
            </h2>
            <p className='text-md'>{project.description}</p>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-medium mb-4'>Period</h2>
            <p className='text-md'>{project.dateString}</p>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-medium mb-4'>
              Technologies Used
            </h2>
            <div className='flex flex-wrap gap-2'>
              {project.tools.map((tool, index) => (
                <Badge key={index} icon>
                  {tool}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProjectViewer;
