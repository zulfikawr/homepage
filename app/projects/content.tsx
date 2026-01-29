'use client';

import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import ProjectCard from '@/components/UI/Card/variants/Project';
import { Icon } from '@/components/UI/Icon';
import { Input } from '@/components/UI/Input';
import { Separator } from '@/components/UI/Separator';
import { ToggleGroup } from '@/components/UI/ToggleGroup';
import { useCollection } from '@/hooks';
import { mapRecordToProject } from '@/lib/mappers';
import { Project } from '@/types/project';
import { sortByDate } from '@/utilities/sortByDate';

interface ProjectsContentProps {
  initialData?: Project[];
}

type StatusFilter = 'all' | 'inProgress' | 'completed' | 'upcoming';

export default function ProjectsContent({ initialData }: ProjectsContentProps) {
  const {
    data: projects,
    loading,
    error,
  } = useCollection<Project>('projects', mapRecordToProject, {}, initialData);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Derive unique tools from all projects
  const allTools = useMemo(() => {
    if (!projects) return [];
    const tools = new Set<string>();
    projects.forEach((p) => p.tools.forEach((t) => tools.add(t)));
    return Array.from(tools).sort();
  }, [projects]);

  // Filter projects based on search, status, and tool
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    let filtered = projects;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (selectedTool) {
      filtered = filtered.filter((p) => p.tools.includes(selectedTool));
    }

    return sortByDate(filtered);
  }, [projects, searchQuery, selectedTool]);

  const pinnedProjects = filteredProjects.filter((p) => p.pinned);
  const wipProjects = filteredProjects.filter(
    (p) => p.status === 'inProgress' && !p.pinned,
  );
  const doneProjects = filteredProjects.filter(
    (p) => p.status === 'completed' && !p.pinned,
  );
  const upcomingProjects = filteredProjects.filter(
    (p) => p.status === 'upcoming' && !p.pinned,
  );

  const showPinned =
    statusFilter === 'all' && (pinnedProjects.length > 0 || loading);
  const showWip =
    (statusFilter === 'all' || statusFilter === 'inProgress') &&
    (wipProjects.length > 0 || loading);
  const showDone =
    (statusFilter === 'all' || statusFilter === 'completed') &&
    (doneProjects.length > 0 || loading);
  const showUpcoming =
    (statusFilter === 'all' || statusFilter === 'upcoming') &&
    (upcomingProjects.length > 0 || loading);

  const hasResults = showPinned || showWip || showDone || showUpcoming;

  if (error) return <CardEmpty message='Failed to load projects' />;

  return (
    <div className='space-y-8'>
      <PageTitle
        emoji='🚀'
        title='Projects'
        subtitle='A collection of my projects, categorized by their status.'
      />

      {/* Controls Section */}
      <div className='-mx-4 px-4 pb-4 pt-2 md:mx-0 md:p-0 space-y-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='relative flex-1'>
            <Icon
              name='magnifyingGlass'
              className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4'
            />
            <Input
              placeholder='Search projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9 bg-card/50'
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <Icon name='x' className='size-3' />
              </button>
            )}
          </div>
          <div className='overflow-x-auto pb-1 -mb-1 scrollbar-hide'>
            <ToggleGroup
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              options={[
                { label: 'All', value: 'all' },
                { label: 'WIP', value: 'inProgress', icon: 'hammer' },
                { label: 'Done', value: 'completed', icon: 'checkCircle' },
                { label: 'Plan', value: 'upcoming', icon: 'calendarPlus' },
              ]}
            />
          </div>
        </div>

        {/* Tools Filter */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide mask-fade-right'>
          <Badge
            variant={selectedTool === null ? 'primary' : 'outline'}
            className={twMerge(
              'cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs transition-all',
              selectedTool !== null && 'hover:bg-primary/20',
            )}
            onClick={() => setSelectedTool(null)}
          >
            All Tools
          </Badge>
          {allTools.map((tool) => (
            <Badge
              key={tool}
              variant={selectedTool === tool ? 'primary' : 'outline'}
              icon
              className={twMerge(
                'cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs transition-all',
                selectedTool !== tool && 'hover:bg-primary/20',
              )}
              onClick={() =>
                setSelectedTool(selectedTool === tool ? null : tool)
              }
            >
              {tool}
            </Badge>
          ))}{' '}
        </div>
      </div>

      <div className='space-y-10 min-h-[50vh]'>
        {!loading && !hasResults && (
          <div className='animate-fade-in flex flex-col items-center justify-center py-12 text-center'>
            <Icon
              name='ghost'
              className='size-12 text-muted-foreground/50 mb-4'
            />
            <h3 className='text-lg font-medium text-foreground'>
              No projects found
            </h3>
            <p className='text-muted-foreground text-sm max-w-xs mt-1'>
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => {
                setSearchQuery('');
                setSelectedTool(null);
                setStatusFilter('all');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pinned Section */}
        {showPinned && (
          <section>
            <SectionTitle
              icon='pushPin'
              title='Pinned'
              iconClassName='text-gruv-red'
            />
            <div className='flex flex-col gap-6 w-full mt-4'>
              {loading ? (
                Array(1)
                  .fill(0)
                  .map((_, index) => (
                    <CardLoading key={index} variant='project' />
                  ))
              ) : (
                <StaggerContainer>
                  {pinnedProjects.map((project) => (
                    <ViewTransition key={project.id}>
                      <ProjectCard project={project} />
                    </ViewTransition>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>
        )}

        {showPinned && (showWip || showDone || showUpcoming) && <Separator />}

        {/* Work in Progress Section */}
        {showWip && (
          <section>
            {(statusFilter === 'all' || statusFilter === 'inProgress') && (
              <SectionTitle
                icon='hammer'
                title='Work in Progress'
                iconClassName='text-gruv-yellow'
              />
            )}
            <div className='flex flex-col gap-6 w-full mt-4'>
              {loading ? (
                Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <CardLoading key={index} variant='project' />
                  ))
              ) : (
                <StaggerContainer>
                  {wipProjects.map((project) => (
                    <ViewTransition key={project.id}>
                      <ProjectCard project={project} />
                    </ViewTransition>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>
        )}

        {showWip && showDone && <Separator />}

        {/* Completed Projects Section */}
        {showDone && (
          <section>
            {(statusFilter === 'all' || statusFilter === 'completed') && (
              <SectionTitle
                icon='checkCircle'
                title='Completed Projects'
                iconClassName='text-gruv-green'
              />
            )}
            <div className='flex flex-col gap-6 w-full mt-4'>
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <CardLoading key={index} variant='project' />
                  ))
              ) : (
                <StaggerContainer>
                  {doneProjects.map((project) => (
                    <ViewTransition key={project.id}>
                      <ProjectCard project={project} />
                    </ViewTransition>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>
        )}

        {showDone && showUpcoming && <Separator />}

        {/* Upcoming Projects Section */}
        {showUpcoming && (
          <section>
            {(statusFilter === 'all' || statusFilter === 'upcoming') && (
              <SectionTitle
                icon='calendarPlus'
                title='Upcoming Projects'
                iconClassName='text-gruv-blue'
              />
            )}
            <div className='flex flex-col gap-6 w-full mt-4'>
              {loading ? (
                Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <CardLoading key={index} variant='project' />
                  ))
              ) : (
                <StaggerContainer>
                  {upcomingProjects.map((project) => (
                    <ViewTransition key={project.id}>
                      <ProjectCard project={project} />
                    </ViewTransition>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
