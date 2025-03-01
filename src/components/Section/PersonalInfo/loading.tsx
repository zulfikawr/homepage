import React from 'react';

const Loading = () => {
  return (
    <div className='animate-pulse'>
      <div className='flex items-center justify-between gap-x-10 gap-y-8'>
        {/* Text Section Skeleton */}
        <div className='-ml-1 flex flex-col gap-y-2'>
          <div className='h-8 w-48 rounded bg-gray-200 dark:bg-gray-700'></div>
          <div className='h-6 w-64 rounded bg-gray-200 dark:bg-gray-700'></div>
        </div>

        {/* Image Section Skeleton */}
        <div className='block flex-shrink-0 pt-1 lg:block'>
          <div className='h-[105px] w-[105px] rounded-xl bg-gray-200 dark:bg-gray-700'></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
