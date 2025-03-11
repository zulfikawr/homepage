'use client';

import { ProjectCard } from '@/components/Card/Project';
import { getProjects } from '@/functions/projects';
import { sortByDate } from '@/utilities/sortByDate';
import { useFetchData } from '@/lib/fetchData';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import Separator from '@/components/UI/Separator';
import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';

export default function ProjectsContent() {
  const { data: projects, loading, error } = useFetchData(getProjects);
  const sortedProjects = projects ? sortByDate(projects) : [];

  const wipProjects = sortedProjects.filter(
    (project) => project.status === 'inProgress',
  );
  const doneProjects = sortedProjects.filter(
    (project) => project.status === 'completed',
  );
  const upcomingProjects = sortedProjects.filter(
    (project) => project.status === 'upcoming',
  );

  if (error) return <div>Failed to load projects</div>;

  return (
    <div>
      <PageTitle
        emoji='🚀'
        title='Projects'
        subtitle='A collection of my projects, categorized by their status.'
        badge={{
          color: 'blue',
          text: 'Active',
        }}
        route='/projects'
      />

      {/* Work in Progress Section */}
      <section>
        <SectionTitle
          icon='hammer'
          title='Work in Progress'
          iconClassName='text-yellow-500'
        />
        <div className='flex flex-col gap-6 w-full'>
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='project' />)
          ) : wipProjects.length > 0 ? (
            wipProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <CardEmpty message='No projects in progress.' />
          )}
        </div>
      </section>

      <Separator />

      {/* Completed Projects Section */}
      <section>
        <SectionTitle
          icon='checkCircle'
          title='Completed Projects'
          iconClassName='text-green-500'
        />
        <div className='flex flex-col gap-6 w-full'>
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='project' />)
          ) : doneProjects.length > 0 ? (
            doneProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <CardEmpty message='No projects completed.' />
          )}
        </div>
      </section>

      <Separator />

      {/* Upcoming Projects Section */}
      <section>
        <SectionTitle
          icon='calendarPlus'
          title='Upcoming Projects'
          iconClassName='text-blue-500'
        />
        <div className='flex flex-col gap-6 w-full'>
          {loading ? (
            Array(2)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='project' />)
          ) : upcomingProjects.length > 0 ? (
            upcomingProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <CardEmpty message='No upcoming projects.' />
          )}
        </div>
      </section>
    </div>
  );
}
