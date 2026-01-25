import { Icon } from 'components/UI';

const LoadingSkeleton = () => (
  <div className='w-full rounded-md border bg-card shadow-sm dark:border-border dark:bg-card'>
    <div className='flex w-full items-center border-b border-border px-4.5 py-2.5 dark:border-border'>
      <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-foreground'>
        <span className='size-5 text-muted-foreground'>
          <Icon name='musicNotes' />
        </span>
        <div className='h-5 w-32 bg-muted rounded animate-pulse' />
      </div>
    </div>

    <div className='flex items-center gap-4 p-4'>
      <div className='h-16 w-16 flex-shrink-0 bg-muted rounded-md animate-pulse' />
      <div className='flex-1 space-y-3'>
        <div className='h-5 w-3/4 bg-muted rounded animate-pulse' />
        <div className='h-4 w-1/2 bg-muted rounded animate-pulse' />
        <div className='flex gap-x-2'>
          <div className='h-3 w-1/4 bg-muted rounded animate-pulse' />
          <div className='h-3 w-[1px] bg-muted rounded animate-pulse' />
          <div className='h-3 w-1/3 bg-muted rounded animate-pulse' />
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
