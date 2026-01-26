import { Icon } from '@/components/UI';

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div
    className={`overflow-hidden min-h-[120px] relative w-full rounded-md border bg-card shadow-sm dark:border-border ${className || ''}`}
  >
    {/* Glass overlay */}
    <div className='absolute inset-0 bg-gruv-fg/5 backdrop-blur-[2px]' />

    <div className='relative h-full flex flex-col'>
      {/* Header - Absolute */}
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-1.5'>
          <Icon name='mapPin' className='size-4 text-muted-foreground' />
          <div className='h-4 w-20 bg-muted rounded animate-pulse' />
        </div>
        <div className='h-4 w-16 bg-muted rounded animate-pulse' />
      </div>

      {/* Center: Time Display */}
      <div className='flex-1 flex items-center justify-center w-full min-h-[120px]'>
        <div className='flex items-center mt-2'>
          {/* Hours */}
          <div className='relative w-8 h-12 bg-muted backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
          {/* Separator */}
          <div className='mx-1 h-6 w-1 bg-muted rounded animate-pulse opacity-50' />
          {/* Minutes */}
          <div className='relative w-8 h-12 bg-muted backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
          {/* Separator */}
          <div className='mx-1 h-6 w-1 bg-muted rounded animate-pulse opacity-50' />
          {/* Seconds */}
          <div className='relative w-8 h-12 bg-muted backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
          {/* AM/PM */}
          <div className='ml-2 flex flex-col justify-between h-12 py-0.5'>
            <div className='h-3 w-5 bg-muted rounded animate-pulse' />
            <div className='h-3 w-5 bg-muted rounded animate-pulse' />
          </div>
        </div>
      </div>

      {/* Footer: Weather Info */}
      <div className='absolute bottom-2 left-0 right-0 flex justify-center'>
        <div className='h-5 w-24 bg-muted rounded-full animate-pulse opacity-50' />
      </div>
    </div>

    {/* Bottom gradient */}
    <div className='absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/5 to-transparent' />
  </div>
);

export default LoadingSkeleton;
