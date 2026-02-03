'use client';

import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import ProjectAnalytics from '@/components/Banners/ProjectAnalytics';
import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import SectionTitle from '@/components/SectionTitle';
import { Badge } from '@/components/UI/Badge';
import { Button } from '@/components/UI/Button';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import ProjectCard from '@/components/UI/Card/variants/Project';
import { Icon } from '@/components/UI/Icon';
import { Input } from '@/components/UI/Input';
import { Separator } from '@/components/UI/Separator';
import { ToggleGroup } from '@/components/UI/ToggleGroup';
import Mask from '@/components/Visual/Mask';
import { Project } from '@/types/project';
import { sortByDate } from '@/utilities/sortByDate';

type StatusFilter = 'all' | 'in_progress' | 'completed' | 'upcoming';

export function ProjectsSkeleton() {
  return (
    <div className='space-y-8'>
      <PageTitle
        emoji='🚀'
        title='Projects'
        subtitle='A collection of my projects, categorized by their status.'
      />
      <ProjectAnalytics projects={[]} loading={true} />
      <div className='flex flex-col gap-y-10'>
        <section>
          <SectionTitle icon='pushPin' title='Pinned' loading={true} />
          <div className='flex flex-col gap-6 mt-4'>
            <CardLoading variant='project' />
          </div>
        </section>
        <Separator />
        <section>
          <SectionTitle icon='hammer' title='Work in Progress' loading={true} />
          <div className='flex flex-col gap-6 mt-4'>
            <CardLoading variant='project' />
            <CardLoading variant='project' />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ProjectsContent({ projects }: { projects: Project[] }) {
  const [search_query, set_search_query] = useState('');
  const [status_filter, set_status_filter] = useState<StatusFilter>('all');
  const [selected_tool, set_selected_tool] = useState<string | null>(null);

  // Derive unique tools from all projects
  const all_tools = useMemo(() => {
    if (!projects) return [];
    const tools = new Set<string>();
    projects.forEach((p) => p.tools.forEach((t) => tools.add(t)));
    return Array.from(tools).sort();
  }, [projects]);

  // Filter projects based on search, status, and tool
  const filtered_projects = useMemo(() => {
    if (!projects) return [];
    let filtered = projects;

    if (search_query) {
      const q = search_query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (selected_tool) {
      filtered = filtered.filter((p) => p.tools.includes(selected_tool));
    }

    return sortByDate(filtered);
  }, [projects, search_query, selected_tool]);

  const pinned_projects = filtered_projects.filter((p) => p.pinned);

  // Show all projects in their respective categories, even if pinned
  // This ensures the sections (WIP, Completed, Upcoming) are always visible if there are projects
  const wip_projects = filtered_projects.filter(
    (p) => p.status === 'in_progress',
  );
  const done_projects = filtered_projects.filter(
    (p) => p.status === 'completed',
  );
  const upcoming_projects = filtered_projects.filter(
    (p) => p.status === 'upcoming',
  );

  const show_pinned = status_filter === 'all' && pinned_projects.length > 0;
  const show_wip =
    (status_filter === 'all' || status_filter === 'in_progress') &&
    wip_projects.length > 0;
  const show_done =
    (status_filter === 'all' || status_filter === 'completed') &&
    done_projects.length > 0;
  const show_upcoming =
    (status_filter === 'all' || status_filter === 'upcoming') &&
    upcoming_projects.length > 0;

  const has_results = show_pinned || show_wip || show_done || show_upcoming;

  return (
    <div className='space-y-8'>
      <PageTitle
        emoji='🚀'
        title='Projects'
        subtitle='A collection of my projects, categorized by their status.'
      />

      <ProjectAnalytics projects={projects || []} loading={false} />

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
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              className='pl-9 bg-card/50'
            />
            {search_query && (
              <button
                onClick={() => set_search_query('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
              >
                <Icon name='x' className='size-3' />
              </button>
            )}
          </div>
          <div className='md:w-fit w-full'>
            <Mask>
              <div className='pb-1'>
                <ToggleGroup
                  value={status_filter}
                  onChange={(v) => set_status_filter(v as StatusFilter)}
                  options={[
                    { label: 'All', value: 'all' },
                    { label: 'WIP', value: 'in_progress', icon: 'hammer' },
                    { label: 'Done', value: 'completed', icon: 'checkCircle' },
                    { label: 'Plan', value: 'upcoming', icon: 'calendarPlus' },
                  ]}
                />
              </div>
            </Mask>
          </div>
        </div>

        {/* Tools Filter */}
        <Mask>
          <div className='flex items-center gap-2 pb-2'>
            <Badge
              variant={selected_tool === null ? 'primary' : 'outline'}
              className={twMerge(
                'cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs transition-all',
                selected_tool !== null && 'hover:bg-primary/20',
              )}
              onClick={() => set_selected_tool(null)}
            >
              All Tools
            </Badge>
            {all_tools.map((tool) => (
              <Badge
                key={tool}
                variant={selected_tool === tool ? 'primary' : 'outline'}
                icon
                className={twMerge(
                  'cursor-pointer whitespace-nowrap px-3 py-1.5 text-xs transition-all',
                  selected_tool !== tool && 'hover:bg-primary/20',
                )}
                onClick={() =>
                  set_selected_tool(selected_tool === tool ? null : tool)
                }
              >
                {tool}
              </Badge>
            ))}
          </div>
        </Mask>
      </div>

      <div className='space-y-10 min-h-[50vh]'>
        {!has_results && (
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
                set_search_query('');
                set_selected_tool(null);
                set_status_filter('all');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pinned Section */}
        {show_pinned && (
          <section>
            <SectionTitle
              icon='pushPin'
              title='Pinned'
              iconClassName='text-gruv-red'
            />
            <div className='flex flex-col gap-6 w-full mt-4'>
              <StaggerContainer>
                {pinned_projects.map((project) => (
                  <ViewTransition key={project.id}>
                    <ProjectCard project={project} />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {show_pinned && (show_wip || show_done || show_upcoming) && (
          <Separator />
        )}

        {/* Work in Progress Section */}
        {show_wip && (
          <section>
            {(status_filter === 'all' || status_filter === 'in_progress') && (
              <SectionTitle
                icon='hammer'
                title='Work in Progress'
                iconClassName='text-gruv-yellow'
              />
            )}
            <div className='flex flex-col gap-6 w-full mt-4'>
              <StaggerContainer>
                {wip_projects.map((project) => (
                  <ViewTransition key={project.id}>
                    <ProjectCard project={project} />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {show_wip && show_done && <Separator />}

        {/* Completed Projects Section */}
        {show_done && (
          <section>
            {(status_filter === 'all' || status_filter === 'completed') && (
              <SectionTitle
                icon='checkCircle'
                title='Completed Projects'
                iconClassName='text-gruv-green'
              />
            )}
            <div className='flex flex-col gap-6 w-full mt-4'>
              <StaggerContainer>
                {done_projects.map((project) => (
                  <ViewTransition key={project.id}>
                    <ProjectCard project={project} />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {show_done && show_upcoming && <Separator />}

        {/* Upcoming Projects Section */}
        {show_upcoming && (
          <section>
            {(status_filter === 'all' || status_filter === 'upcoming') && (
              <SectionTitle
                icon='calendarPlus'
                title='Upcoming Projects'
                iconClassName='text-gruv-blue'
              />
            )}
            <div className='flex flex-col gap-6 w-full mt-4'>
              <StaggerContainer>
                {upcoming_projects.map((project) => (
                  <ViewTransition key={project.id}>
                    <ProjectCard project={project} />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
