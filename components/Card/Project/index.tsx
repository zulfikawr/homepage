import Image from 'next/image';
import { Project } from '@/types/project';
import { drawer } from '@/components/Drawer';
import ProjectViewer from '@/components/Viewer/Project';
import { Hover } from '@/components/Visual';
import { Card } from '@/components/Card';

export interface ProjectCardProps extends Project {
  isInDrawer?: boolean;
}

const ProjectCard = (props: ProjectCardProps) => {
  const { name, image, description, tools, favicon, isInDrawer } = props;

  const handleCardClick = () => {
    drawer.open(<ProjectViewer project={props} />);
  };

  return (
    <Card
      onClick={() => {
        if (!isInDrawer) handleCardClick();
      }}
      isInDrawer={isInDrawer}
    >
      <div className='relative h-48 w-full flex-shrink-0 overflow-hidden rounded-t-md shadow-sm sm:hidden'>
        <Hover perspective={1000} max={25} scale={1.01}>
          <Image
            src={image}
            className='object-cover dark:brightness-[95%]'
            alt={`featured-image-${name}`}
            loading='lazy'
            height={480}
            width={640}
          />
        </Hover>
      </div>

      {/* Desktop layout */}
      <div className='flex flex-1 flex-col p-4 sm:flex-row sm:items-center sm:gap-6'>
        {/* Image container */}
        <div className='relative hidden h-32 w-56 flex-shrink-0 overflow-hidden rounded-md shadow-sm transition-all hover:shadow-md dark:opacity-90 sm:block'>
          <Hover perspective={1000} max={25} scale={1.01}>
            <Image
              src={image}
              className='rounded-md object-cover dark:brightness-[95%]'
              alt={`featured-image-${name}`}
              loading='lazy'
              height={480}
              width={640}
            />
          </Hover>
        </div>

        {/* Main content container */}
        <div className='flex w-full flex-col justify-between gap-4 sm:min-h-[100px]'>
          {/* Name at the top */}
          <div className='border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-700 dark:border-neutral-700 dark:text-white'>
            <div className='flex items-center'>
              {favicon && (
                <span className='mr-3 inline-block'>
                  <Image src={favicon} height={20} width={20} alt={name} />
                </span>
              )}
              {name}
            </div>
          </div>

          {/* Description in the middle */}
          <p className='text-sm text-neutral-600 dark:text-neutral-300'>
            {description}
          </p>

          {/* Tools at the bottom */}
          <div className='flex flex-wrap gap-2 border-t border-neutral-200 pt-2.5 dark:border-neutral-700'>
            {tools.map((tool, index) => (
              <span
                key={index}
                className='rounded-full border bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-400'
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export { ProjectCard };
