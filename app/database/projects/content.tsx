'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Badge, Button, Card, Icon, Input, ToggleGroup } from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import ProjectCard from '@/components/UI/Card/variants/Project';
import Mask from '@/components/Visual/Mask';
import { useCollection } from '@/hooks';
import { mapRecordToProject } from '@/lib/mappers';
import { Project } from '@/types/project';
import { sortByDate } from '@/utilities/sortByDate';

type StatusFilter = 'all' | 'in_progress' | 'completed' | 'upcoming';

export default function ProjectsDatabase() {
  const router = useRouter();

  const {
    data: projects,
    loading,
    error,
  } = useCollection<Project>('projects', mapRecordToProject);

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

    if (status_filter !== 'all') {
      filtered = filtered.filter((p) => p.status === status_filter);
    }

    if (selected_tool) {
      filtered = filtered.filter((p) => p.tools.includes(selected_tool));
    }

    return sortByDate(filtered);
  }, [projects, search_query, status_filter, selected_tool]);

  if (error) return <CardEmpty message='Failed to load projects' />;

  const handle_add_project = () => {
    router.push('/database/projects/new');
  };

  return (
    <div className='space-y-6'>
      <PageTitle emoji='🚀' title='Projects' subtitle='Manage your projects' />

      {/* Controls Section */}
      <div className='space-y-4'>
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
                <Icon name='x' className='size-4' />
              </button>
            )}
          </div>
          <div className='overflow-x-auto pb-1 -mb-1 scrollbar-hide'>
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
        </div>

        {/* Tools Filter */}
        <Mask className='-m-1 scrollbar-hide pb-2'>
          <div className='flex items-center gap-2 m-1'>
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

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} variant='project' />)
        ) : (
          <>
            <ViewTransition>
              <Card isPreview>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handle_add_project}
                  className='my-8 mx-auto'
                >
                  Add New Project
                </Button>
              </Card>
            </ViewTransition>

            {filtered_projects.length > 0 ? (
              <StaggerContainer>
                {filtered_projects.map((project) => (
                  <ViewTransition key={project.id}>
                    <ProjectCard project={project} openForm />
                  </ViewTransition>
                ))}
              </StaggerContainer>
            ) : (
              <div className='py-12 flex flex-col items-center justify-center text-center'>
                <Icon
                  name='ghost'
                  className='size-12 text-muted-foreground/50 mb-4'
                />
                <h3 className='text-lg font-medium text-foreground'>
                  No projects found
                </h3>
                <p className='text-muted-foreground text-sm max-w-xs mt-1'>
                  Try adjusting your search or filters.
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
                  Clear filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
