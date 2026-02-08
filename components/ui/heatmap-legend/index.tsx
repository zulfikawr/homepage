'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Skeleton } from '@/components/ui/skeleton';

export const getHeatmapIntensityClass = (intensity: number) => {
  switch (intensity) {
    case 1:
      return 'bg-heatmap-1';
    case 2:
      return 'bg-heatmap-2';
    case 3:
      return 'bg-heatmap-3';
    case 4:
      return 'bg-heatmap-4';
    case 5:
      return 'bg-heatmap-5';
    case 6:
      return 'bg-heatmap-6';
    default:
      return 'bg-heatmap-0';
  }
};

const HeatmapLegend = ({ isLoading = false }: { isLoading?: boolean }) => {
  return (
    <div className='flex items-center justify-end gap-1 text-xs text-muted-foreground'>
      <span className='h-4 flex items-center'>
        {isLoading ? <Skeleton width={24} height={12} as='span' /> : 'Less'}
      </span>
      {[0, 1, 2, 3, 4, 5, 6].map((intensity) => (
        <div
          key={intensity}
          className={twMerge(
            'w-3 h-3 rounded-sm',
            !isLoading && getHeatmapIntensityClass(intensity),
          )}
        >
          {isLoading && (
            <Skeleton
              width='100%'
              height='100%'
              as='span'
              className='block'
              style={{ borderRadius: '2px' }}
            />
          )}
        </div>
      ))}
      <span className='h-4 flex items-center'>
        {isLoading ? <Skeleton width={32} height={12} as='span' /> : 'More'}
      </span>
    </div>
  );
};

export default HeatmapLegend;
