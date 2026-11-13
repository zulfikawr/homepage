'use client';

import { useMemo } from 'react';

import { Card, Icon, Separator } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';
import { useLoadingToggle } from '@/contexts/loading-context';
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
}

const TEMPLATE_STATS = {
  totalProjects: 4,
  totalCompleted: 3,
  mostUsed: {
    name: 'React',
    count: 4,
    percentage: 100,
    share: 40,
    color: COLORS[0],
  },
  topTools: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js'].map(
    (name, index) => ({
      name,
      count: 5 - index,
      percentage: 100 - index * 15,
      share: 30 - index * 4,
      color: COLORS[index % COLORS.length],
    }),
  ),
};

function ProjectAnalyticsHeader({ totalProjects }: { totalProjects?: number }) {
  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        <Icon name='chartBar' className='size-7 text-theme-aqua' />
        <span>Tech Stack Radar</span>
      </div>
      {totalProjects !== undefined && (
        <div className='text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border'>
          {totalProjects} Projects Tracked
        </div>
      )}
    </div>
  );
}

export default function ProjectAnalytics({
  projects,
  loading: initialLoading,
}: ProjectAnalyticsProps) {
  const { forceLoading } = useLoadingToggle();
  const loading = initialLoading || forceLoading;

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

  const renderStats = loading ? TEMPLATE_STATS : stats;

  return (
    <div className='w-full'>
      <Shimmer loading={loading}>
        <Card isPreview>
          <ProjectAnalyticsHeader totalProjects={renderStats?.totalProjects} />
          <Separator margin='0' />

          <div className='p-4'>
            {renderStats ? (
              <div className='space-y-6'>
                {/* Highlight Section */}
                <div className='flex items-center gap-4'>
                  <div className='flex items-center justify-center size-16 rounded-xl bg-theme-bg-soft border border-border shadow-sm'>
                    <Icon
                      name={getIconName(renderStats.mostUsed.name)}
                      className='size-8 text-foreground'
                    />
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-lg font-bold text-foreground'>
                        {renderStats.mostUsed.name}
                      </h2>
                      <span className='text-[10px] uppercase tracking-wider font-bold text-theme-bg bg-theme-green px-1.5 py-0.5 rounded-sm'>
                        Top Pick
                      </span>
                    </div>
                    <p className='text-sm text-muted-foreground mt-0.5'>
                      Used in{' '}
                      <span className='text-foreground font-medium'>
                        {renderStats.mostUsed.percentage}%
                      </span>{' '}
                      of my projects.
                    </p>
                  </div>
                </div>

                {/* Stats Bars */}
                <div className='space-y-3'>
                  {renderStats.topTools.map((tool) => (
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
                    <div className='text-xl font-bold text-theme-green'>
                      {renderStats.totalCompleted}
                    </div>
                    <div className='text-[10px] uppercase tracking-wider text-muted-foreground font-medium'>
                      Completed
                    </div>
                  </div>
                  <div className='bg-muted/30 rounded-lg p-2 text-center border border-border/50'>
                    <div className='text-xl font-bold text-theme-yellow'>
                      {renderStats.totalProjects - renderStats.totalCompleted}
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
      </Shimmer>
    </div>
  );
}
