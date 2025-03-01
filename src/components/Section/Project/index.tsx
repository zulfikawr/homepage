import Link from 'next/link';
import { ProjectCard } from '~/components/Card/Project';
import { Icon } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import { getProjects } from '~/functions/projects';
import { useAuth } from '~/contexts/authContext';
import { sortByDate } from '~/utilities/sortByDate';
import { useFetchData } from '~/lib/fetchData';
import ProjectsDrawer from './drawer';

const ProjectSection = () => {
  const { user } = useAuth();
  const { data: projects, loading, error } = useFetchData(getProjects);

  const handleOpenProjectsDrawer = () => {
    drawer.open(<ProjectsDrawer projects={sortedProjects} />);
  };

  const sortedProjects = projects ? sortByDate(projects) : [];

  if (error) return <div>Failed to load projects</div>;
  if (loading) return null;
  if (!projects) return <div>No projects found</div>;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <div
          onClick={user ? handleOpenProjectsDrawer : undefined}
          className={`inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm ${
            user ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : ''
          } dark:border-gray-600 dark:bg-gray-700`}
        >
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='package' />
          </span>
          <span className='block uppercase'>Selected Projects</span>
        </div>
        <Link
          href='/projects'
          target='_blank'
          className='flex items-center gap-x-2 flex items-center gap-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        >
          All Projects
          <span className='h-5 w-5'>
            <Icon name='arrowSquareOut' />
          </span>
        </Link>
      </div>
      <div className='mt-5 flex flex-col gap-y-4'>
        {sortedProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
