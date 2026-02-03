'use client';

import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Card, Icon, Separator, Skeleton } from '@/components/ui';
import { Project } from '@/types/project';

// Gruvbox palette for visualization
const COLORS = [
  '#fb4934', // Red
  '#b8bb26', // Green
  '#fabd2f', // Yellow
  '#83a598', // Blue
  '#d3869b', // Purple
  '#8ec07c', // Aqua
  '#fe8019', // Orange
];

interface ProjectAnalyticsProps {
  projects: Project[];
  loading?: boolean;
  className?: string;
}

export default function ProjectAnalytics({
  projects,
  loading,
  className,
}: ProjectAnalyticsProps) {
  const stats = useMemo(() => {
    if (!projects || projects.length === 0) return null;

    const toolCounts: Record<string, number> = {};
    let totalToolUsages = 0;

    projects.forEach((p) => {
      p.tools.forEach((tool) => {
        toolCounts[tool] = (toolCounts[tool] || 0) + 1;
        totalToolUsages++;
      });
    });

    const sortedTools = Object.entries(toolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count,
        // Percentage of projects that use this tool
        percentage: Math.round((count / projects.length) * 100),
        // Share of total tool usages (for the bar chart segments if we wanted a stacked bar)
        share: Math.round((count / totalToolUsages) * 100),
        color: COLORS[index % COLORS.length],
      }));

    return {
      totalProjects: projects.length,
      topTools: sortedTools,
      mostUsed: sortedTools[0],
      totalCompleted: projects.filter((p) => p.status === 'completed').length,
    };
  }, [projects]);

  // Helper to normalize icon names
  const getIconName = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName === 'next.js') return 'nextjs';
    if (lowerName === 'node.js') return 'nodejs';
    if (lowerName === 'vue.js') return 'vuejs';
    return lowerName;
  };

  const Header = () => (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        {loading ? (
          <>
            <Skeleton width={28} height={28} className='rounded-md' />
            <Skeleton width={150} height={20} />
          </>
        ) : (
          <>
            <Icon name='chartBar' className='size-7 text-gruv-aqua' />
            <span>Tech Stack Radar</span>
          </>
        )}
      </div>
      {!loading && stats && (
        <div className='text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border'>
          {stats.totalProjects} Projects Tracked
        </div>
      )}
    </div>
  );

  return (
    <div className={twMerge('w-full', className)}>
      <Card isPreview>
        <Header />
        <Separator margin='0' />

        <div className='p-4'>
          {loading ? (
            <div className='space-y-4'>
              <div className='flex gap-4'>
                <Skeleton width={64} height={64} className='rounded-lg' />
                <div className='flex-1 space-y-2'>
                  <Skeleton width={100} height={20} />
                  <Skeleton width={140} height={16} />
                </div>
              </div>
              <div className='space-y-3 pt-2'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='space-y-1'>
                    <div className='flex justify-between'>
                      <Skeleton width={60} height={14} />
                      <Skeleton width={30} height={14} />
                    </div>
                    <Skeleton
                      width='100%'
                      height={8}
                      className='rounded-full'
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : stats ? (
            <div className='space-y-6'>
              {/* Highlight Section */}
              <div className='flex items-center gap-4'>
                <div className='flex items-center justify-center size-16 rounded-xl bg-gruv-bg-soft border border-border shadow-sm'>
                  <Icon
                    name={getIconName(stats.mostUsed.name)}
                    className='size-8 text-foreground'
                  />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-bold text-foreground'>
                      {stats.mostUsed.name}
                    </h3>
                    <span className='text-[10px] uppercase tracking-wider font-bold text-gruv-bg bg-gruv-green px-1.5 py-0.5 rounded-sm'>
                      Top Pick
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground mt-0.5'>
                    Used in{' '}
                    <span className='text-foreground font-medium'>
                      {stats.mostUsed.percentage}%
                    </span>{' '}
                    of my projects.
                  </p>
                </div>
              </div>

              {/* Stats Bars */}
              <div className='space-y-3'>
                {stats.topTools.map((tool) => (
                  <div key={tool.name}>
                    <div className='flex items-center justify-between text-xs mb-1.5'>
                      <div className='flex items-center gap-2'>
                        <Icon
                          name={getIconName(tool.name)}
                          className='size-3.5 text-muted-foreground'
                        />
                        <span className='font-medium text-muted-foreground'>
                          {tool.name}
                        </span>
                      </div>
                      <span className='text-muted-foreground tabular-nums'>
                        {tool.count}{' '}
                        <span className='text-[10px] ml-0.5 opacity-70'>
                          projs
                        </span>
                      </span>
                    </div>
                    <div className='h-2 w-full bg-muted/50 rounded-full overflow-hidden'>
                      <div
                        className='h-full rounded-full transition-all duration-1000 ease-out'
                        style={{
                          width: `${tool.percentage}%`,
                          backgroundColor: tool.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini Footer Stats */}
              <div className='grid grid-cols-2 gap-2 pt-2'>
                <div className='bg-muted/30 rounded-lg p-2 text-center border border-border/50'>
                  <div className='text-xl font-bold text-gruv-green'>
                    {stats.totalCompleted}
                  </div>
                  <div className='text-[10px] uppercase tracking-wider text-muted-foreground font-medium'>
                    Completed
                  </div>
                </div>
                <div className='bg-muted/30 rounded-lg p-2 text-center border border-border/50'>
                  <div className='text-xl font-bold text-gruv-yellow'>
                    {stats.totalProjects - stats.totalCompleted}
                  </div>
                  <div className='text-[10px] uppercase tracking-wider text-muted-foreground font-medium'>
                    In Progress
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='py-8 text-center text-muted-foreground'>
              <Icon
                name='chartBar'
                className='size-12 mx-auto mb-2 opacity-20'
              />
              <p>No project data available</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
