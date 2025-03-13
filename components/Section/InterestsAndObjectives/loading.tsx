import Separator from '@/components/UI/Separator';

const Loading = () => {
  return (
    <div className='animate-pulse flex flex-col px-1'>
      {/* Description placeholder */}
      <div className='-mt-1 space-y-3'>
        <div className='h-[16px] w-full rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-[16px] w-full rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-[16px] w-1/6 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>

      {/* Divider */}
      <Separator margin='5' />

      {/* Objectives section */}
      <div className='h-[16px] w-48 rounded bg-neutral-200 dark:bg-neutral-700' />

      {/* Objectives list */}
      <div className='mt-4.5 space-y-4'>
        {[1, 2, 3].map((index) => (
          <div key={index} className='flex items-center gap-x-6'>
            <div className='h-2 w-2 rounded-full bg-neutral-500 dark:bg-neutral-300' />
            <div className='h-[16px] w-full rounded bg-neutral-200 dark:bg-neutral-700' />
          </div>
        ))}
      </div>

      {/* Conclusion placeholder */}
      <div className='mt-5 space-y-3'>
        <div className='h-[16px] w-full rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-[16px] w-4/5 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </div>
  );
};

export default Loading;
