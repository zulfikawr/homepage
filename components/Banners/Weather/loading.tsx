'use client';

import { Card } from '@/components/Card';

const LoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <Card isPreview className={`${className || ''} px-4 py-3`}>
      <div className='relative h-full flex flex-col gap-y-4'>
        {/* Header */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-x-3'>
            <div className='size-7 bg-muted rounded-md animate-pulse' />
            <div className='h-5 w-24 bg-muted rounded animate-pulse' />
          </div>
          <div className='h-4 w-20 bg-muted rounded animate-pulse' />
        </div>

        {/* Center: Time Display */}
        <div className='flex-1 flex items-center justify-center w-full'>
          <div className='flex items-center'>
            {/* HH */}
            <div className='w-8 h-12 bg-muted rounded-md animate-pulse mx-0.5' />
            {/* : */}
            <div className='mx-1 text-xl font-bold text-muted animate-pulse'>
              :
            </div>
            {/* MM */}
            <div className='w-8 h-12 bg-muted rounded-md animate-pulse mx-0.5' />
            {/* : */}
            <div className='mx-1 text-xl font-bold text-muted animate-pulse'>
              :
            </div>
            {/* SS */}
            <div className='w-8 h-12 bg-muted rounded-md animate-pulse mx-0.5' />

            <div className='ml-2 flex flex-col justify-between h-12 py-0.5'>
              <div className='h-3 w-4 bg-muted rounded animate-pulse' />
              <div className='h-3 w-4 bg-muted rounded animate-pulse' />
            </div>
          </div>
        </div>

        {/* Footer: Weather Info */}
        <div className='flex justify-center'>
          <div className='h-6 w-32 bg-muted rounded-full animate-pulse' />
        </div>
      </div>
    </Card>
  );
};

export default LoadingSkeleton;
