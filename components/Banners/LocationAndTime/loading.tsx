const LoadingSkeleton = () => (
  <div className='overflow-hidden min-h-[120px] relative w-full rounded-md border bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 shadow-sm dark:border-gray-700'>
    {/* Glass overlay */}
    <div className='absolute inset-0 bg-white/5 backdrop-blur-[2px]' />

    {/* Content */}
    <div className='relative z-10 p-6'>
      <div className='flex flex-col items-start space-y-4'>
        {/* Location and Date */}
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-5 bg-white/20 rounded animate-pulse' />
            <div className='h-5 w-32 bg-white/20 rounded animate-pulse' />
          </div>
          <div className='h-5 w-24 bg-white/20 rounded animate-pulse' />
        </div>

        {/* Clock Skeleton */}
        <div className='flex items-center justify-center w-full'>
          <div className='flex items-center'>
            {/* Hours */}
            <div className='relative w-8 h-12 bg-white/10 backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
            {/* Minutes */}
            <div className='relative w-8 h-12 bg-white/10 backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
            {/* Seconds */}
            <div className='relative w-8 h-12 bg-white/10 backdrop-blur-sm rounded-md overflow-hidden mx-1.5 animate-pulse' />
            {/* AM/PM */}
            <div className='ml-2 flex flex-col justify-between h-12'>
              <div className='h-4 w-6 bg-white/10 rounded animate-pulse' />
              <div className='h-4 w-6 bg-white/10 rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom gradient */}
    <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent' />
  </div>
);

export default LoadingSkeleton;
