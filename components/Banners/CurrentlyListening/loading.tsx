import { Icon } from 'components/UI';

const LoadingSkeleton = () => (
  <div className='w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
    <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
      <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
        <span className='h-4.5 w-4.5 lg:h-7 lg:w-7'>
          <Icon name='musicNotes' />
        </span>
        <div className='h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
      </div>
    </div>

    <div className='flex items-center gap-4 p-4'>
      <div className='h-16 w-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse' />
      <div className='flex-1 space-y-3'>
        <div className='h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        <div className='h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        <div className='flex gap-x-2'>
          <div className='h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          <div className='h-3 w-[1px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
          <div className='h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
