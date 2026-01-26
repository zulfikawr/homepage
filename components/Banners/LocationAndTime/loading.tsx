import { Icon } from '@/components/UI';

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={`overflow-hidden min-h-[120px] relative w-full rounded-md border bg-card shadow-sm dark:border-border ${className || ''}`}>
    {/* Glass overlay */}
    <div className='absolute inset-0 bg-gruv-fg/5 backdrop-blur-[2px]' />

    {/* Content */}
    <div className='relative px-4.5 py-2.5'>
      <div className='flex flex-col items-start space-y-4'>
        {/* Location and Date */}
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <Icon name='mapPin' className='size-5 text-muted-foreground' />
            <div className='h-5 w-32 bg-muted rounded animate-pulse' />
          </div>
          <div className='h-5 w-16 bg-muted rounded animate-pulse' />
        </div>

        {/* Clock Skeleton */}
        <div className='flex items-center justify-center w-full'>
          <div className='flex items-center'>
            {/* Hours */}
            <div className='relative w-8 h-12 bg-muted backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
            {/* Minutes */}
            <div className='relative w-8 h-12 bg-muted backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
            {/* Seconds */}
            <div className='relative w-8 h-12 bg-muted backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
            {/* AM/PM */}
            <div className='ml-2 flex flex-col justify-between h-12'>
              <div className='h-4 w-6 bg-muted rounded animate-pulse' />
              <div className='h-4 w-6 bg-muted rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom gradient */}
    <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gruv-bg/10 to-transparent' />
  </div>
);

export default LoadingSkeleton;
