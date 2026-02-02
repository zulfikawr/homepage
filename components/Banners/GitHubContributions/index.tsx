import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Card } from '@/components/UI';
import {
  Button,
  HeatmapLegend,
  Icon,
  Separator,
  Skeleton,
  Tooltip,
} from '@/components/UI';
import CardEmpty from '@/components/UI/Card/variants/Empty';
import { getHeatmapIntensityClass } from '@/components/UI/HeatmapLegend';
import Mask from '@/components/Visual/Mask';
import { useLoadingToggle } from '@/contexts/loadingContext';
import { getGitHubContributions } from '@/lib/github';
import { GitHubContributionData } from '@/types/github';

const apiCache: {
  data: GitHubContributionData | null;
  lastFetched: number;
} = {
  data: null,
  lastFetched: 0,
};

const getIntensityLevel = (count: number) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  if (count <= 15) return 4;
  if (count <= 25) return 5;
  return 6;
};

const BannerHeader = ({ isLoading = false }: { isLoading?: boolean }) => {
  const GoToGithubButton = (
    <Link
      href='https://github.com/zulfikawr'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} />
        ) : (
          <Icon name='caretRight' className='size-5' />
        )}
      </Button>
    </Link>
  );

  return (
    <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
      <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
        {isLoading ? (
          <>
            <Skeleton width={28} height={28} className='rounded-md' />
            <Skeleton width={160} height={20} />
          </>
        ) : (
          <>
            <Icon name='githubLogo' className='size-7 text-gruv-orange' />
            <span>GitHub Contributions</span>
          </>
        )}
      </div>

      <div className='hidden md:block'>
        <Tooltip text='GitHub'>{GoToGithubButton}</Tooltip>
      </div>

      <div className='block md:hidden'>{GoToGithubButton}</div>
    </div>
  );
};

const GitHubContributionsLayout = ({
  isLoading,
  data,
}: {
  isLoading: boolean;
  data: GitHubContributionData | null;
}) => {
  return (
    <Card isPreview>
      <BannerHeader isLoading={isLoading} />

      <Separator margin='0' />

      <div className='p-4 space-y-4'>
        {/* Stats row */}
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground h-4 leading-4 flex items-center'>
              Total Contributions
            </p>
            <div className='text-2xl font-bold text-gruv-aqua h-8 leading-8 flex items-center'>
              {isLoading ? (
                <Skeleton width={60} height={24} as='span' />
              ) : (
                data?.totalContributions.toLocaleString()
              )}
            </div>
          </div>
          <div className='text-right space-y-1 flex flex-col items-end'>
            <p className='text-xs text-muted-foreground h-4 leading-4 flex items-center'>
              Year
            </p>
            <div className='text-sm text-gruv-fg-dim font-medium h-5 leading-5 flex items-center'>
              {isLoading ? (
                <Skeleton width={35} height={14} as='span' />
              ) : (
                data?.year
              )}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <Mask className='-m-1 p-1 scrollbar-hide'>
          <div className='flex gap-1 min-w-max'>
            {isLoading
              ? Array.from({ length: 52 }).map((_, weekIndex) => (
                  <div key={weekIndex} className='flex flex-col gap-1'>
                    {Array.from({ length: 7 }).map((_, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className='relative inline-flex items-center justify-center'
                      >
                        <Skeleton
                          className='w-3 h-3 rounded-sm'
                          style={{
                            animationDelay: `${(weekIndex + dayIndex) * 0.02}s`,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))
              : data?.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className='flex flex-col gap-1'>
                    {week.map((day, dayIndex) => (
                      <Tooltip
                        key={`${weekIndex}-${dayIndex}`}
                        text={`${day.date}: ${day.count} contributions`}
                      >
                        <div
                          className={`w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:ring-1 hover:ring-gruv-orange/50 ${getHeatmapIntensityClass(getIntensityLevel(day.count))}`}
                        />
                      </Tooltip>
                    ))}
                  </div>
                ))}
          </div>
        </Mask>

        {/* Legend */}
        <div className='pt-4'>
          <HeatmapLegend isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
};

const GitHubContributionsBanner = () => {
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

  return <GitHubContributionsLayout isLoading={isLoading} data={data} />;
};

export default GitHubContributionsBanner;
