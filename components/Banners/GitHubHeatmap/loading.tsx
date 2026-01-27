'use client';

import { Card } from '@/components/Card';
import { Separator } from '@/components/UI';

import BannerHeader from './header';

const LoadingSkeleton = () => {
  return (
    <Card isPreview>
      <BannerHeader isLoading />

      <Separator margin='0' />

      <div className='p-4 space-y-4'>
        {/* Total contributions skeleton */}
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <div className='h-4 w-24 bg-muted rounded animate-pulse' />
            <div className='h-8 w-16 bg-muted rounded animate-pulse' />
          </div>
          <div className='space-y-1 text-right'>
            <div className='h-4 w-12 bg-muted rounded animate-pulse' />
            <div className='h-5 w-8 bg-muted rounded animate-pulse' />
          </div>
        </div>

        {/* Heatmap skeleton */}
        <div className='overflow-x-auto -m-1 p-1'>
          <div className='flex gap-1 min-w-max'>
            {Array.from({ length: 52 }).map((_, weekIndex) => (
              <div key={weekIndex} className='flex flex-col gap-1'>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className='relative inline-flex items-center justify-center'
                  >
                    <div
                      className='w-3 h-3 rounded-sm bg-muted animate-pulse'
                      style={{
                        animationDelay: `${(weekIndex + dayIndex) * 0.02}s`,
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend skeleton */}
        <div className='pt-2'>
          <div className='flex items-center justify-end gap-1'>
            <div className='h-4 w-6 bg-muted rounded animate-pulse' />
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className='h-3 w-3 rounded-sm bg-muted animate-pulse'
              />
            ))}
            <div className='h-4 w-8 bg-muted rounded animate-pulse' />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoadingSkeleton;
