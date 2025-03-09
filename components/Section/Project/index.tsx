import { ProjectCard } from 'components/Card/Project';
import { drawer } from 'components/Drawer';
import { getProjects } from 'functions/projects';
import { useAuth } from 'contexts/authContext';
import { sortByDate } from 'utilities/sortByDate';
import { useFetchData } from 'lib/fetchData';
import ProjectsDrawer from './drawer';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';

const ProjectSection = () => {
  const { user } = useAuth();
  const { data: projects, loading, error, refetch } = useFetchData(getProjects);

  const sortedProjects = projects ? sortByDate(projects) : [];

  const handleOpenProjectsDrawer = () => {
    drawer.open(
      <ProjectsDrawer projects={sortedProjects} onUpdate={refetch} />,
    );
  };

  if (error) return <div>Failed to load projects</div>;

  return (
    <section>
      <SectionTitle
        icon='package'
        title='Selected Projects'
        link={{
          href: '/projects',
          label: 'All Projects',
        }}
        onClick={handleOpenProjectsDrawer}
        isClickable={!!user}
      />
      <div className='flex flex-col gap-y-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='project' />)
        ) : sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))
        ) : (
          <CardEmpty message='No projects found.' />
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
