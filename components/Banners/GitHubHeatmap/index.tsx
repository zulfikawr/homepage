'use client';

import { useEffect, useState } from 'react';

import { Card } from '@/components/Card';
import CardEmpty from '@/components/Card/Empty';
import { HeatmapLegend, Icon, Tooltip } from '@/components/UI';
import { getHeatmapIntensityClass } from '@/components/UI/HeatmapLegend';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { getGitHubContributions } from '@/lib/github';
import { GitHubContributionData } from '@/types/github';

import LoadingSkeleton from './loading';

const apiCache: {
  data: GitHubContributionData | null;
  lastFetched: number;
} = {
  data: null,
  lastFetched: 0,
};

const GitHubHeatmap = () => {
  const [data, setData] = useState<GitHubContributionData | null>(
    apiCache.data,
  );
  const [loading, setLoading] = useState(!apiCache.data);
  const [error, setError] = useState<string | null>(null);
  const { forceLoading, forceEmpty } = useLoadingToggle();

  const isLoading = loading || forceLoading;

  useEffect(() => {
    const fetchData = async () => {
      if (
        !apiCache.data ||
        Date.now() - apiCache.lastFetched > 1000 * 60 * 60
      ) {
        setLoading(true);
        setError(null);

        try {
          const contributions = await getGitHubContributions();

          if (contributions) {
            setData(contributions);
            apiCache.data = contributions;
            apiCache.lastFetched = Date.now();
          } else {
            setError('Failed to fetch contributions');
          }
        } catch {
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      } else {
        setData(apiCache.data);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error || forceEmpty)
    return <CardEmpty message='No data - Check GITHUB_TOKEN' />;

  if (isLoading) return <LoadingSkeleton />;

  if (!data) return <CardEmpty message='No data' />;

  const { totalContributions, weeks, year } = data;

  return (
    <Card isPreview>
      <div className='flex w-full items-center justify-between border-b border-border px-4.5 py-2.5 dark:border-border'>
        <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-foreground'>
          <span className='size-5 text-gruv-blue'>
            <Icon name='githubLogo' />
          </span>
          <span>GitHub Contributions</span>
        </div>
      </div>

      <div className='p-4 space-y-4'>
        {/* Stats row */}
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground'>Total Contributions</p>
            <p className='text-2xl font-bold text-gruv-aqua'>
              {totalContributions.toLocaleString()}
            </p>
          </div>
          <div className='text-right space-y-1'>
            <p className='text-xs text-muted-foreground'>Year</p>
            <p className='text-sm text-gruv-fg-dim font-medium'>{year}</p>
          </div>
        </div>

        {/* Heatmap */}
        <div className='overflow-x-auto -m-1 p-1'>
          <div className='flex gap-1 min-w-max'>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className='flex flex-col gap-1'>
                {week.map((day, dayIndex) => (
                  <Tooltip
                    key={`${weekIndex}-${dayIndex}`}
                    text={`${day.date}: ${day.count} contributions`}
                  >
                    <div
                      className={`w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:ring-1 hover:ring-gruv-orange/50 ${getHeatmapIntensityClass(day.intensity)}`}
                    />
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='pt-2'>
          <HeatmapLegend />
        </div>
      </div>
    </Card>
  );
};

export default GitHubHeatmap;
