import { Project } from '@/types/project';
import { drawer } from '@/components/Drawer';
import ProjectViewer from '@/components/Viewer/Project';
import { Hover } from '@/components/Visual';
import { Card } from '@/components/Card';
import { Badge } from '@/components/UI';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
  openForm?: boolean;
  isInForm?: boolean;
}

export default function ProjectCard({
  project,
  openForm,
  isInForm,
}: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

    if (openForm) {
      router.push(`/database/projects/${project.id}/edit`);
    } else {
      drawer.open(<ProjectViewer project={project} />);
    }
  };

  return (
    <Card onClick={handleCardClick} isInDrawer={openForm} isInForm={isInForm}>
      <div className='relative h-48 w-full flex-shrink-0 overflow-hidden rounded-t-md shadow-sm sm:hidden'>
        <Hover perspective={1000} max={25} scale={1.01}>
          <ImageWithFallback
            src={project.image}
            alt={project.name}
            className='object-cover dark:brightness-[95%]'
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
            <ImageWithFallback
              src={project.image}
              alt={project.name}
              height={480}
              width={640}
              className='rounded-md object-cover dark:brightness-[95%]'
              loading='lazy'
            />
          </Hover>
        </div>

        {/* Main content container */}
        <div className='flex w-full flex-col justify-between gap-4 sm:min-h-[100px]'>
          {/* Name at the top */}
          <div className='border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-700 dark:border-neutral-700 dark:text-white'>
            <div className='flex items-center'>
              {project.favicon && (
                <span className='mr-3 inline-block'>
                  <ImageWithFallback
                    src={project.favicon}
                    alt={project.name}
                    height={20}
                    width={20}
                    type='square'
                  />
                </span>
              )}
              {project.name}
            </div>
          </div>

          {/* Description in the middle */}
          <p className='text-sm text-neutral-600 dark:text-neutral-300'>
            {project.description}
          </p>

          {/* Tools at the bottom */}
          <div className='flex flex-wrap gap-2 border-t border-neutral-200 pt-2.5 dark:border-neutral-700'>
            {project.tools.map((tool, index) => (
              <Badge key={index} icon>
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ProjectCard };
