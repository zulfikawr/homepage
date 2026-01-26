'use client';

import { Card } from '@/components/Card';

const LoadingSkeleton = () => {
  return (
    <Card isPreview>
      <div className='flex w-full items-center justify-between border-b border-border px-4.5 py-2.5 dark:border-border'>
        <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-foreground'>
          <span className='size-5 text-gruv-blue'>
            <svg viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
              <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
            </svg>
          </span>
          <span>GitHub Contributions</span>
        </div>
      </div>

      <div className='p-4 space-y-4'>
        {/* Total contributions skeleton */}
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <div className='h-4 w-24 bg-muted rounded animate-pulse' />
            <div className='h-6 w-16 bg-muted rounded animate-pulse' />
          </div>
          <div className='space-y-2 text-right'>
            <div className='h-4 w-12 bg-muted rounded animate-pulse' />
            <div className='h-4 w-8 bg-muted rounded animate-pulse' />
          </div>
        </div>

        {/* Heatmap skeleton */}
        <div className='flex gap-1 overflow-x-auto pb-2'>
          {Array.from({ length: 52 }).map((_, weekIndex) => (
            <div key={weekIndex} className='flex flex-col gap-1'>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className='w-3 h-3 rounded-sm bg-muted animate-pulse'
                  style={{
                    animationDelay: `${(weekIndex + dayIndex) * 0.02}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend skeleton */}
        <div className='flex items-center justify-end gap-2'>
          <div className='h-3 w-3 rounded-sm bg-muted animate-pulse' />
          <div className='h-3 w-3 rounded-sm bg-muted animate-pulse' />
          <div className='h-3 w-3 rounded-sm bg-muted animate-pulse' />
          <div className='h-3 w-3 rounded-sm bg-muted animate-pulse' />
          <div className='h-3 w-3 rounded-sm bg-muted animate-pulse' />
        </div>
      </div>
    </Card>
  );
};

export default LoadingSkeleton;
