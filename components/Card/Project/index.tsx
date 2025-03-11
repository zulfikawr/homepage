import Image from 'next/image';
import { Project } from 'types/project';
import { drawer } from 'components/Drawer';
import ProjectViewer from 'components/Viewer/Project';
import { Hover } from '@/components/Visual';
import { Card } from 'components/Card';

export interface ProjectCardProps extends Project {
  isInDrawer?: boolean;
}

const ProjectCard = (props: ProjectCardProps) => {
  const { name, image, description, tools, isInDrawer } = props;

  const handleCardClick = () => {
    drawer.open(<ProjectViewer project={props} />);
  };

  return (
    <Card
      onClick={() => {
        if (!isInDrawer) handleCardClick();
      }}
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

      <div className='flex flex-1 flex-col items-center gap-4 p-4 sm:flex-row'>
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

        <div className='flex w-full flex-col justify-between gap-y-2'>
          <p className='border-b border-gray-200 pb-2 text-lg font-semibold text-gray-700 dark:border-gray-700 dark:text-white'>
            {name}
          </p>

          <p className='text-sm text-gray-600 dark:text-gray-300'>
            {description}
          </p>

          <div className='flex flex-wrap gap-2 border-t border-gray-200 pt-2.5 dark:border-gray-700'>
            {tools.map((tool, index) => (
              <span
                key={index}
                className='rounded-full border bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
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
