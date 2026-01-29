'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { StaggerContainer, ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Badge, Button, Icon, Input, ToggleGroup } from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { CardLoading } from '@/components/UI/Card/variants/Loading';
import ProjectCard from '@/components/UI/Card/variants/Project';
import { useCollection } from '@/hooks';
import { mapRecordToProject } from '@/lib/mappers';
import { Project } from '@/types/project';
import { sortByDate } from '@/utilities/sortByDate';

type StatusFilter = 'all' | 'inProgress' | 'completed' | 'upcoming';

export default function ProjectsDatabase() {
  const router = useRouter();

  const {
    data: projects,
    loading,
    error,
  } = useCollection<Project>('projects', mapRecordToProject);

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

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (selectedTool) {
      filtered = filtered.filter((p) => p.tools.includes(selectedTool));
    }

    return sortByDate(filtered);
  }, [projects, searchQuery, statusFilter, selectedTool]);

  if (error) return <CardEmpty message='Failed to load projects' />;

  const handleAddProject = () => {
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
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        {loading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <CardLoading key={index} variant='project' />)
        ) : (
          <>
            <ViewTransition>
              <div className='w-full rounded-md border bg-white text-center shadow-sm dark:bg-card p-5'>
                <Button
                  variant='primary'
                  icon='plus'
                  onClick={handleAddProject}
                  className='mx-auto'
                >
                  Add New Project
                </Button>
              </div>
            </ViewTransition>

            {filteredProjects.length > 0 ? (
              <StaggerContainer>
                {filteredProjects.map((project) => (
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
                    setSearchQuery('');
                    setSelectedTool(null);
                    setStatusFilter('all');
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
