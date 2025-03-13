import { Icon } from 'components/UI';

const LoadingSkeleton = () => (
  <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
    <div className='flex w-full items-center border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
      <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
        <span className='size-5'>
          <Icon name='musicNotes' />
        </span>
        <div className='h-5 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      </div>
    </div>

    <div className='flex items-center gap-4 p-4'>
      <div className='h-16 w-16 flex-shrink-0 bg-neutral-200 dark:bg-neutral-700 rounded-md animate-pulse' />
      <div className='flex-1 space-y-2'>
        <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
        <div className='h-4 w-1/2 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
        <div className='flex gap-x-2'>
          <div className='h-3 w-1/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
          <div className='h-3 w-[1px] bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
          <div className='h-3 w-1/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
