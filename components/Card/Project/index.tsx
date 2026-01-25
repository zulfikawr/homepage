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
  isActive?: boolean;
}

export default function ProjectCard({
  project,
  openForm,
  isInForm,
  isActive,
}: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

    const identifier = project.slug || project.id;
    if (openForm) {
      router.push(`/database/projects/${identifier}/edit`);
    } else {
      drawer.open(<ProjectViewer project={project} />);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      isInDrawer={openForm}
      isInForm={isInForm}
      isActive={isActive}
    >
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
          <div className='border-b border-border pb-2 text-lg text-foreground font-semibold dark:border-border'>
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
          <p className='text-sm text-muted-foreground'>{project.description}</p>

          {/* Tools at the bottom */}
          <div className='flex flex-wrap gap-2 border-t border-border pt-2.5 dark:border-border'>
            {project.tools.map((tool, index) => {
              const colors: (
                | 'aqua'
                | 'green'
                | 'yellow'
                | 'blue'
                | 'red'
                | 'default'
              )[] = ['aqua', 'green', 'yellow', 'blue', 'red'];
              const badgeType = colors[index % colors.length];
              return (
                <Badge key={index} type={badgeType} icon>
                  {tool}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

export { ProjectCard };
