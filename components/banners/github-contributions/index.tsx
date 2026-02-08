'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Card } from '@/components/ui';
import {
  Button,
  HeatmapLegend,
  Icon,
  Separator,
  Skeleton,
  Tooltip,
} from '@/components/ui';
import CardEmpty from '@/components/ui/card/variants/empty';
import { getHeatmapIntensityClass } from '@/components/ui/heatmap-legend';
import Mask from '@/components/visual/mask';
import { useLoadingToggle } from '@/contexts/loading-context';
import { GitHubContributionData } from '@/types/github';

const getIntensityLevel = (count: number) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  if (count <= 15) return 4;
  if (count <= 25) return 5;
  return 6;
};

const BannerHeader = ({
  isLoading = false,
  showMoreButton = true,
}: {
  isLoading?: boolean;
  showMoreButton?: boolean;
}) => {
  const GoToGithubButton = (
    <Link
      href='https://github.com/zulfikawr'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Button className='h-7 !p-1 dark:bg-muted tracking-normal'>
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
            <Icon name='githubLogo' className='size-7 text-primary' />
            <span>GitHub Contributions</span>
          </>
        )}
      </div>

      {showMoreButton && (
        <>
          <div className='hidden md:block'>
            <Tooltip text='GitHub'>{GoToGithubButton}</Tooltip>
          </div>

          <div className='block md:hidden'>{GoToGithubButton}</div>
        </>
      )}
    </div>
  );
};

export const GitHubContributionsLayout = ({
  isLoading,
  data,
  showMoreButton = true,
}: {
  isLoading: boolean;
  data: GitHubContributionData | null;
  showMoreButton?: boolean;
}) => {
  return (
    <Card isPreview>
      <BannerHeader isLoading={isLoading} showMoreButton={showMoreButton} />

      <Separator margin='0' />

      <div className='p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-xs text-muted-foreground h-4 leading-4 flex items-center'>
              Total Contributions
            </p>
            <div className='text-2xl font-bold text-theme-aqua h-8 leading-8 flex items-center'>
              {isLoading ? (
                <Skeleton width={60} height={24} as='span' />
              ) : (
                data?.total_contributions?.toLocaleString() || '0'
              )}
            </div>
          </div>
          <div className='text-right space-y-1 flex flex-col items-end'>
            <p className='text-xs text-muted-foreground h-4 leading-4 flex items-center'>
              Year
            </p>
            <div className='text-sm text-theme-fg-dim font-medium h-5 leading-5 flex items-center'>
              {isLoading ? (
                <Skeleton width={35} height={14} as='span' />
              ) : (
                data?.year || new Date().getFullYear()
              )}
            </div>
          </div>
        </div>

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
              : data?.weeks?.map((week, weekIndex) => (
                  <div key={weekIndex} className='flex flex-col gap-1'>
                    {week.map((day, dayIndex) => (
                      <Tooltip
                        key={`${weekIndex}-${dayIndex}`}
                        text={`${day.date}: ${day.count} contributions`}
                      >
                        <div
                          className={twMerge(
                            'w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:ring-1 hover:ring-theme-orange/50',
                            getHeatmapIntensityClass(
                              getIntensityLevel(day.count),
                            ),
                          )}
                        />
                      </Tooltip>
                    ))}
                  </div>
                ))}
          </div>
        </Mask>

        <div className='pt-4'>
          <HeatmapLegend isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
};

const emptySubscribe = () => () => {};

export default function GitHubContributionsBanner({
  data,
  isLoading = false,
  showMoreButton = true,
}: {
  data: GitHubContributionData | null;
  isLoading?: boolean;
  showMoreButton?: boolean;
}) {
  const { forceLoading } = useLoadingToggle();
  const loading = isLoading || forceLoading;

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <GitHubContributionsLayout
        isLoading={true}
        data={null}
        showMoreButton={showMoreButton}
      />
    );
  }

  if (!data && !loading)
    return <CardEmpty message='No data - Check GITHUB_TOKEN' />;

  return (
    <GitHubContributionsLayout
      isLoading={loading}
      data={data}
      showMoreButton={showMoreButton}
    />
  );
}
