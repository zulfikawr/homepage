'use client';

import SectionTitle from '@/components/SectionTitle';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { Project } from '@/types/project';
import { parseDate } from '@/utilities/sortByDate';

import ProjectClient from './ProjectClient';

export const ProjectLayout = ({
  projects,
  isLoading = false,
}: {
  projects?: Project[];
  isLoading?: boolean;
}) => {
  function sort_projects_by_pinned_and_date(projects: Project[]): Project[] {
    const pinned_projects = projects.filter((p) => p.pinned);

    const sorted_pinned_projects = pinned_projects
      .sort(
        (a, b) =>
          parseDate(b.date_string).getTime() -
          parseDate(a.date_string).getTime(),
      )
      .slice(0, 5);
    return [...sorted_pinned_projects];
  }

  const sorted_projects = projects
    ? sort_projects_by_pinned_and_date(projects)
    : [];

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
        ) : sorted_projects.length > 0 ? (
          <ProjectClient projects={sorted_projects} />
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
