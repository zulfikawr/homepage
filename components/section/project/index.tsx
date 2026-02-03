'use client';

import SectionTitle from '@/components/section-title';
import CardEmpty from '@/components/ui/card/variants/empty';
import { CardLoading } from '@/components/ui/card/variants/loading';
import { useLoadingToggle } from '@/contexts/loading-context';
import { Project } from '@/types/project';
import { parseDate } from '@/utilities/sort-by-date';

import ProjectClient from './project-client';

export const ProjectLayout = ({
  projects,
  isLoading = false,
}: {
  projects?: Project[];
  isLoading?: boolean;
}) => {
  function sortProjectsByPinnedAndDate(projects: Project[]): Project[] {
    const pinnedProjects = projects.filter((p) => p.pinned);

    const sortedPinnedProjects = pinnedProjects
      .sort(
        (a, b) =>
          parseDate(b.date_string).getTime() -
          parseDate(a.date_string).getTime(),
      )
      .slice(0, 5);
    return [...sortedPinnedProjects];
  }

  const sortedProjects = projects ? sortProjectsByPinnedAndDate(projects) : [];

  return (
    <section>
      <SectionTitle
        icon='package'
        title='Pinned Projects'
        loading={isLoading}
        link={
          !isLoading
            ? {
                href: '/projects',
                label: 'All Projects',
              }
            : undefined
        }
      />
      <div className='flex flex-col gap-y-4'>
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <CardLoading key={i} variant='project' />)
        ) : sortedProjects.length > 0 ? (
          <ProjectClient projects={sortedProjects} />
        ) : (
          <CardEmpty message='No projects found.' />
        )}
      </div>
    </section>
  );
};

export default function ProjectSection({ data }: { data: Project[] }) {
  const { forceLoading } = useLoadingToggle();

  if (forceLoading) {
    return <ProjectLayout isLoading={true} />;
  }

  return <ProjectLayout projects={data} isLoading={false} />;
}
