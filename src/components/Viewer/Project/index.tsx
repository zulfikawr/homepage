import React from 'react';
import Image from 'next/image';
import { Icon, Button } from '~/components/UI';
import { Project } from '~/types/project';
import { drawer } from '~/components/Drawer';
import ProjectForm from '~/components/Form/Project';
import { useAuth } from '~/contexts/authContext';

const ProjectViewer = ({ project }: { project: Project }) => {
  const { user } = useAuth();
  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center gap-4'>
          <div className='flex-1 flex items-center'>
            <h1 className='flex items-center text-2xl font-medium tracking-wide text-black dark:text-white'>
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
              onClick={() => window.open(project.link, '_blank')}
              className='flex items-center gap-2'
            >
              <span className='h-5 w-5'>
                <Icon name='externalLink' />
              </span>
              Visit Project
            </Button>
            {user && (
              <Button
                onClick={() =>
                  drawer.open(<ProjectForm projectToEdit={project} />)
                }
              >
                Edit
              </Button>
            )}
            <Button type='default' onClick={() => drawer.close()}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-8'>
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

          {/* Overview Section */}
          <section>
            <h2 className='text-xl sm:text-2xl font-medium mb-4'>Overview</h2>
            <div className='prose dark:prose-invert max-w-none'>
              <p>{project.description}</p>
            </div>
          </section>

          {/* Technologies Section */}
          <section className='pb-4'>
            <h2 className='text-xl sm:text-2xl font-medium mb-4'>
              Technologies Used
            </h2>
            <div className='flex flex-wrap gap-2'>
              {project.tools.map((tool, index) => (
                <span
                  key={index}
                  className='px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
