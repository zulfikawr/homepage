import { ProjectCard } from '@/components/Card/Project';
import { projectsData } from '@/database/projects';
import { parseDate } from '@/utilities/sortByDate';
import SectionTitle from '@/components/SectionTitle';
import { CardLoading } from '@/components/Card/Loading';
import CardEmpty from '@/components/Card/Empty';
import { Project } from '@/types/project';
import { useRealtimeData } from '@/hooks';

const ProjectSection = () => {
  const { data: projects, loading, error } = useRealtimeData(projectsData);

  function sortProjectsByPinnedAndDate(projects: Project[]): Project[] {
    const pinnedProjects = projects.filter((p) => p.pinned);

    const sortedPinnedProjects = pinnedProjects
      .sort(
        (a, b) =>
          parseDate(b.dateString).getTime() - parseDate(a.dateString).getTime(),
      )
      .slice(0, 5);
    return [...sortedPinnedProjects];
  }

  const sortedProjects = projects ? sortProjectsByPinnedAndDate(projects) : [];

  if (error) return <CardEmpty message='Failed to load projects' />;

  return (
    <section>
      <SectionTitle
        icon='package'
        title='Pinned Projects'
        loading={loading}
        link={{
          href: '/projects',
          label: 'All Projects',
        }}
      />
      <div className='flex flex-col gap-y-4'>
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => <CardLoading key={index} type='project' />)
        ) : sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <CardEmpty message='No projects found.' />
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
