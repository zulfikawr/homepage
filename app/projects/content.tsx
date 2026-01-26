'use client';

import CardEmpty from '@/components/Card/Empty';
import { CardLoading } from '@/components/Card/Loading';
import ProjectCard from '@/components/Card/Project';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import { Separator } from '@/components/UI/Separator';
import { useCollection } from '@/hooks';
import { mapRecordToProject } from '@/lib/mappers';
import { Project } from '@/types/project';
import { sortByDate } from '@/utilities/sortByDate';

export default function ProjectsContent() {
  const {
    data: projects,
    loading,
    error,
  } = useCollection<Project>('projects', mapRecordToProject);

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

  if (error) return <CardEmpty message='Failed to load projects' />;

  return (
    <div>
      <PageTitle
        emoji='🚀'
        title='Projects'
        subtitle='A collection of my projects, categorized by their status.'
      />

      {/* Work in Progress Section */}
      <section>
        <SectionTitle
          icon='hammer'
          title='Work in Progress'
          iconClassName='text-gruv-yellow'
        />
        <div className='flex flex-col gap-6 w-full'>
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='project' />)
          ) : wipProjects.length > 0 ? (
            <StaggerContainer>
              {wipProjects.map((project) => (
                <ViewTransition key={project.id}>
                  <ProjectCard project={project} />
                </ViewTransition>
              ))}
            </StaggerContainer>
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
          iconClassName='text-gruv-green'
        />
        <div className='flex flex-col gap-6 w-full'>
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='project' />)
          ) : doneProjects.length > 0 ? (
            <StaggerContainer>
              {doneProjects.map((project) => (
                <ViewTransition key={project.id}>
                  <ProjectCard project={project} />
                </ViewTransition>
              ))}
            </StaggerContainer>
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
          iconClassName='text-gruv-blue'
        />
        <div className='flex flex-col gap-6 w-full'>
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, index) => <CardLoading key={index} type='project' />)
          ) : upcomingProjects.length > 0 ? (
            <StaggerContainer>
              {upcomingProjects.map((project) => (
                <ViewTransition key={project.id}>
                  <ProjectCard project={project} />
                </ViewTransition>
              ))}
            </StaggerContainer>
          ) : (
            <CardEmpty message='No upcoming projects.' />
          )}
        </div>
      </section>
    </div>
  );
}
