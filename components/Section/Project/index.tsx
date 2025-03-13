import { ProjectCard } from '@/components/Card/Project';
import { drawer } from '@/components/Drawer';
import { getProjects } from '@/functions/projects';
import { useAuth } from '@/contexts/authContext';
import { parseDate } from '@/utilities/sortByDate';
import { useFetchData } from '@/lib/fetchData';
import ProjectsDrawer from '@/components/Drawer/Project';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';
import { Project } from '@/types/project';

const ProjectSection = () => {
  const { user } = useAuth();
  const { data: projects, loading, error, refetch } = useFetchData(getProjects);

  function sortProjectsByPinnedAndDate(projects: Project[]): Project[] {
    const pinnedProjects = projects.filter((p) => p.pinned);
    const nonPinnedProjects = projects.filter((p) => !p.pinned);

    const sortedPinnedProjects = pinnedProjects
      .sort(
        (a, b) =>
          parseDate(b.dateString).getTime() - parseDate(a.dateString).getTime(),
      )
      .slice(0, 5);

    const sortedNonPinnedProjects = nonPinnedProjects.sort(
      (a, b) =>
        parseDate(b.dateString).getTime() - parseDate(a.dateString).getTime(),
    );

    return [...sortedPinnedProjects, ...sortedNonPinnedProjects];
  }

  const sortedProjects = projects ? sortProjectsByPinnedAndDate(projects) : [];

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
        title='Pinned Projects'
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
