'use client';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import SectionTitle from '@/components/SectionTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { ProjectCard } from '@/components/UI/Card/variants/Project';
import { useCollection } from '@/hooks';
import { mapRecordToProject } from '@/lib/mappers';
import { Project } from '@/types/project';
import { parseDate } from '@/utilities/sortByDate';

const ProjectSection = () => {
  const {
    data: projects,
    loading,
    error,
  } = useCollection<Project>('projects', mapRecordToProject);

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
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} variant='project' />)
        ) : sortedProjects.length > 0 ? (
          <div className='flex flex-col gap-y-4'>
            <StaggerContainer>
              {sortedProjects.map((project) => (
                <ViewTransition key={project.id}>
                  <ProjectCard project={project} />
                </ViewTransition>
              ))}
            </StaggerContainer>
          </div>
        ) : (
          <CardEmpty message='No projects found.' />
        )}
      </div>
    </section>
  );
};

export default ProjectSection;
