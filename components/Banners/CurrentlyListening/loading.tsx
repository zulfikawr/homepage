import { Card } from '@/components/Card';
import { Separator } from '@/components/UI';

import BannerHeader from './header';

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <Card isPreview className={className}>
    <BannerHeader isLoading />

    <Separator margin='0' />

    {/* Mirroring the Link container layout */}
    <div className='flex items-center gap-4 p-4'>
      {/* Mirroring the Hover wrapper */}
      <div className='relative h-16 w-16 flex-shrink-0'>
        <div className='h-full w-full bg-muted rounded-md animate-pulse' />
      </div>

      {/* Text content container */}
      <div className='flex-1 min-w-0 space-y-1'>
        {/* h3 text-md (24px line-height) */}
        <div className='h-6 w-3/4 bg-muted rounded animate-pulse' />

        {/* p text-sm (20px line-height) */}
        <div className='h-5 w-1/2 bg-muted rounded animate-pulse' />

        {/* footer text-xs (16px line-height) with gap-x-2 */}
        <div className='flex items-center gap-x-2'>
          <div className='h-4 w-1/4 bg-muted rounded animate-pulse' />
          <div className='h-4 w-[1px] bg-muted rounded animate-pulse' />
          <div className='h-4 w-1/3 bg-muted rounded animate-pulse' />
        </div>
      </div>
    </div>
  </Card>
);

export default LoadingSkeleton;
