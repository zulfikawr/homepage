import Link from 'next/link';
import { ProjectCard } from '~/components/Card/Project';
import { Icon, Button } from '~/components/UI';
import { drawer } from '~/components/Drawer';
import ProjectForm from '~/components/Form/Project';
import { getProjects } from '~/functions/projects';
import { useAuth } from '~/contexts/authContext';
import { sortByDate } from '~/utilities/sortByDate';
import { useFetchData } from '~/lib/fetchData';

const ProjectSection = () => {
  const { user } = useAuth();
  const { data: projects, loading, error } = useFetchData(getProjects);

  const handleAddProject = () => {
    drawer.open(<ProjectForm />);
  };

  const sortedProjects = projects ? sortByDate(projects) : [];

  if (error) return <div>Failed to load projects</div>;
  if (loading) return <div>Loading...</div>;
  if (!projects) return <div>No projects found</div>;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <label className='inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-[4px] font-medium tracking-wider shadow-sm dark:border-gray-600 dark:bg-gray-700'>
          <span className='mr-1.5 flex h-5 w-5'>
            <Icon name='article' />
          </span>
          <span className='block uppercase'>Selected Projects</span>
        </label>
        <Link
          href='/projects'
          target='_blank'
          className='flex items-center gap-x-1 text-gray-500 underline-offset-4 hover:underline dark:text-gray-400'
        >
          All Projects
          <span className='h-5 w-5 underline'>
            <Icon name='externalLink' />
          </span>
        </Link>
      </div>
      <div className='mt-5 flex flex-col gap-y-4'>
        {sortedProjects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>

      {user && (
        <div className='mt-6 flex justify-center'>
          <Button
            type='primary'
            onClick={handleAddProject}
            className='flex items-center gap-2'
          >
            <span className='h-5 w-5'>
              <Icon name='plus' />
            </span>
            Add Project
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProjectSection;
