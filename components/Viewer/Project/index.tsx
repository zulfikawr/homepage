import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/UI';
import { Project } from '@/types/project';
import { drawer } from '@/components/Drawer';
import Separator from '@/components/UI/Separator';

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
                  <Image
                    src={project.favicon}
                    height={30}
                    width={30}
                    alt={project.name}
                  />
                </span>
              )}
              {project.name}
            </h1>
          </div>
          <div className='flex gap-4'>
            <Button
              type='primary'
              icon='arrowSquareOut'
              onClick={() => window.open(project.link, '_blank')}
            >
              <span className='hidden lg:block'>Visit</span>
            </Button>
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
              <Image
                src={project.image}
                alt={project.name}
                className='object-cover'
                fill
              />
            </div>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-medium mb-4'>Overview</h2>
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
                <span
                  key={index}
                  className='px-3 py-1 rounded-full text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProjectViewer;
