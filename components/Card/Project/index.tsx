import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/Card';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Badge } from '@/components/UI';
import { Hover } from '@/components/Visual';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  openForm?: boolean;
  isInForm?: boolean;
  isActive?: boolean;
  isPreview?: boolean;
}

export default function ProjectCard({
  project,
  openForm,
  isInForm,
  isActive,
  isPreview,
}: ProjectCardProps) {
  const router = useRouter();

  const identifier = project.slug || project.id;
  const href = openForm
    ? `/database/projects/${identifier}/edit`
    : `/projects/${identifier}`;

  const handleCardClick = () => {
    if (isInForm) return;
    router.push(href);
  };

  const cardContent = (
    <Card
      onClick={isInForm ? undefined : handleCardClick}
      isInDrawer={openForm}
      isInForm={isInForm}
      isActive={isActive}
      isPreview={isPreview}
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
            sizes='100vw'
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
              sizes='(max-width: 768px) 100vw, 224px'
            />
          </Hover>
        </div>

        {/* Main content container */}
        <div className='flex w-full flex-col justify-between gap-4 sm:min-h-[100px]'>
          {/* Name at the top */}
          <div className='border-b border-border pb-2'>
            <div className='flex items-center'>
              {project.favicon && (
                <span className='mr-3 inline-block'>
                  <ImageWithFallback
                    src={project.favicon}
                    alt={project.name}
                    height={20}
                    width={20}
                    type='square'
                    sizes='20px'
                  />
                </span>
              )}
              <h1 className='text-lg text-foreground group-hover:text-primary transition-color duration-200 font-semibold'>
                {project.name}
              </h1>
            </div>
          </div>

          {/* Description in the middle */}
          <p className='text-sm text-muted-foreground'>{project.description}</p>

          {/* Tools at the bottom */}
          <div className='flex flex-wrap gap-2 border-t border-border pt-2.5 '>
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

  if (isInForm || isPreview) {
    return cardContent;
  }

  return (
    <Link href={href} prefetch={true} className='block'>
      {cardContent}
    </Link>
  );
}

export { ProjectCard };
