import { Separator } from '@/components/UI/Separator';

const LoadingSkeleton = () => (
  <article className='p-4 pt-24 lg:pt-20'>
    <div className='mb-4 flex items-center'>
      <div className='flex flex-1 items-center'>
        <div>
          <h2 className='flex items-center gap-x-2 text-[28px] font-medium tracking-wide text-foreground'>
            <div className='h-8 w-48 bg-muted dark:bg-muted rounded animate-pulse' />
            <span className='rounded-full border border-blue-300 bg-gruv-blue/10 p-2 text-xs text-blue-500 dark:border-blue-700 dark:bg-blue-800 dark:text-gruv-blue'>
              <div className='h-3 w-8 bg-muted dark:bg-muted rounded animate-pulse' />
            </span>
          </h2>
          <div className='h-5 w-72 bg-muted dark:bg-muted rounded animate-pulse mt-3' />
        </div>
      </div>
    </div>

    <Separator margin='5' />

    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-8 w-72 bg-muted dark:bg-muted rounded animate-pulse mb-4' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-muted dark:bg-muted rounded animate-pulse' />
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-8 w-72 bg-muted dark:bg-muted rounded animate-pulse mb-4' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-muted dark:bg-muted rounded animate-pulse' />
    </div>
    <div className='flex flex-col space-y-2 mb-10'>
      <div className='h-8 w-72 bg-muted dark:bg-muted rounded animate-pulse mb-4' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-full bg-muted dark:bg-muted rounded animate-pulse' />
      <div className='h-5 w-3/4 bg-muted dark:bg-muted rounded animate-pulse' />
    </div>
  </article>
);

export default LoadingSkeleton;
