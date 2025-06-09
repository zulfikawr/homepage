import Separator from '@/components/UI/Separator';

const LoadingSkeleton = () => (
  <article className='p-4 pt-24 lg:pt-20'>
    <div className='mb-4 flex items-center'>
      <div className='flex flex-1 items-center'>
        <div>
          <h2 className='flex items-center gap-x-2 text-[28px] font-medium tracking-wide text-black dark:text-white'>
            <div className='h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
            <span className='rounded-full border border-blue-300 bg-blue-50 p-2 text-xs text-blue-500 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400'>
              <div className='h-3 w-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
            </span>
          </h2>
          <div className='h-5 w-72 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mt-3' />
        </div>
      </div>
    </div>

    <Separator margin='5' />

    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-8 w-72 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-4' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-8 w-72 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-4' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-8 w-72 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-4' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
    </div>
  </article>
);

export default LoadingSkeleton;
