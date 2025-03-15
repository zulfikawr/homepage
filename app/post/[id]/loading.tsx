import { Label } from '@/components/UI';

const LoadingSkeleton = () => (
  <article className='p-4 pt-24 lg:p-20 lg:pt-20'>
    <div className='mb-20'>
      <div className='mb-3 flex flex-wrap gap-2'>
        <Label type='primary' icon='folder'>
          <div className='h-4 w-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
        </Label>
      </div>
      <h1 className='text-1 lg:text-5xl font-medium leading-snug tracking-wider'>
        <div className='h-12 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      </h1>
      <div className='mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400'>
        <span className='flex items-center'>
          <div className='h-5 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
        </span>
      </div>
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse' />
    </div>
  </article>
);

export default LoadingSkeleton;
