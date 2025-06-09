import Separator from '@/components/UI/Separator';

const BaseCardLoading = ({ children }: { children: React.ReactNode }) => (
  <div className='relative flex w-full flex-col rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
    <div className='animate-pulse'>{children}</div>
  </div>
);

const PodcastCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='h-[196px] w-full rounded-t-md bg-neutral-200 dark:bg-neutral-700' />
      <div className='px-3.5 pb-5 pt-4.5'>
        <div className='mb-2 h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='space-y-2'>
          <div className='h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700' />
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 dark:border-neutral-700'>
        <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </>
  </BaseCardLoading>
);

const BookCardLoading = () => (
  <BaseCardLoading>
    <div className='flex flex-1 items-center'>
      <div className='flex-shrink-0 px-4.5 py-4'>
        <div className='h-[52px] w-[35px] rounded-sm bg-neutral-200 dark:bg-neutral-700' />
      </div>
      <div className='py-2 pr-4 space-y-2'>
        <div className='h-4 w-24 md:w-40 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-3 w-16 md:w-32 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </div>
    <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-3 dark:border-neutral-700'>
      <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
      <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
    </div>
  </BaseCardLoading>
);

const EmploymentCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='flex w-full min-w-[18rem] lg:min-w-[25rem] items-center justify-between gap-x-2.5 border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
        <div className='flex items-center gap-x-2'>
          <div className='h-[24px] w-[24px] rounded-full bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-5 w-32 rounded bg-neutral-200 dark:bg-neutral-700' />
        </div>
        <div className='h-5 w-24 rounded-full border bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700' />
      </div>
      <div className='flex items-center justify-between gap-x-2.5 px-4.5 py-4'>
        <div className='h-[14px] w-40 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-[14px] w-24 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
      <div className='flex items-center justify-between border-t border-neutral-200 px-4.5 py-[10px] dark:border-neutral-700'>
        <div className='h-[12px] w-32 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-[12px] w-20 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </>
  </BaseCardLoading>
);

const ProjectCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='relative h-48 w-full flex-shrink-0 rounded-t-md bg-neutral-200 dark:bg-neutral-700 sm:hidden' />
      <div className='flex flex-1 flex-col items-center gap-4 p-4 sm:flex-row'>
        <div className='relative hidden h-32 w-56 flex-shrink-0 rounded-md bg-neutral-200 dark:bg-neutral-700 sm:block' />
        <div className='flex w-full flex-col justify-between gap-y-2'>
          <div className='h-7 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
          <Separator margin='1' />
          <div className='space-y-2'>
            <div className='h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700' />
            <div className='h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700' />
          </div>
          <Separator margin='1' />
          <div className='flex flex-wrap gap-2'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700'
              />
            ))}
          </div>
        </div>
      </div>
    </>
  </BaseCardLoading>
);

const PostCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='flex gap-6 p-6 lg:gap-8 lg:p-8'>
        <div className='h-40 w-40 rounded-md bg-neutral-200 dark:bg-neutral-700' />
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex flex-wrap items-center gap-2 lg:gap-4'>
            <div className='h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700' />
            <div className='h-6 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700' />
          </div>
          <div className='h-8 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='space-y-2'>
            <div className='h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700' />
            <div className='h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700' />
          </div>
        </div>
      </div>
      <div className='flex h-auto w-full items-center justify-between rounded-bl-md rounded-br-md border-t border-neutral-100 px-6 py-3 dark:border-neutral-700 lg:px-8 lg:py-3'>
        <div className='h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </>
  </BaseCardLoading>
);

const PlaylistCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='grid grid-cols-4 items-center gap-4 p-4'>
        <div className='col-span-1 flex justify-center aspect-square'>
          <div className='h-20 w-20 rounded-md bg-neutral-200 dark:bg-neutral-700' />
        </div>
        <div className='col-span-3 space-y-1'>
          <div className='h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
          <div className='h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700' />
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </>
  </BaseCardLoading>
);

const CertificateCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='grid grid-cols-4 items-center gap-4 p-4'>
        <div className='col-span-1 flex justify-center aspect-square md:aspect-video'>
          <div className='h-20 w-20 md:h-[5rem] md:w-full rounded-md bg-neutral-200 dark:bg-neutral-700' />
        </div>
        <div className='col-span-3'>
          <div className='h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
          <Separator margin='2' />
          <div className='space-y-1'>
            <div className='h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700' />
            <div className='h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700' />
          </div>
        </div>
      </div>
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
        <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
    </>
  </BaseCardLoading>
);

const PublicationCardLoading = () => (
  <BaseCardLoading>
    <div className='p-4 space-y-2'>
      <div className='h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
      <div className='h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700' />
      <div className='h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700' />
      <div className='flex flex-wrap gap-2'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-700'
          />
        ))}
      </div>
    </div>
    <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4 py-2 text-sm font-light text-neutral-500 dark:border-neutral-700 dark:text-neutral-400'>
      <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
      <div className='h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700' />
    </div>
  </BaseCardLoading>
);

const TrackCardLoading = () => (
  <BaseCardLoading>
    <div className='flex items-center space-x-4 p-3'>
      <div className='h-4 w-6 rounded bg-neutral-200 dark:bg-neutral-700' />
      <div className='h-12 w-12 rounded-md bg-neutral-200 dark:bg-neutral-700' />
      <div className='flex-1 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700' />
        <div className='h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700' />
      </div>
      <div className='h-3 w-10 rounded bg-neutral-200 dark:bg-neutral-700' />
    </div>
  </BaseCardLoading>
);

type CardLoadingProps = {
  type:
    | 'podcast'
    | 'book'
    | 'employment'
    | 'project'
    | 'post'
    | 'playlist'
    | 'certificate'
    | 'publication'
    | 'track';
};

const CardLoading = ({ type }: CardLoadingProps) => {
  switch (type) {
    case 'podcast':
      return <PodcastCardLoading />;
    case 'book':
      return <BookCardLoading />;
    case 'employment':
      return <EmploymentCardLoading />;
    case 'project':
      return <ProjectCardLoading />;
    case 'post':
      return <PostCardLoading />;
    case 'playlist':
      return <PlaylistCardLoading />;
    case 'certificate':
      return <CertificateCardLoading />;
    case 'publication':
      return <PublicationCardLoading />;
    case 'track':
      return <TrackCardLoading />;
    default:
      return <PodcastCardLoading />;
  }
};

export { CardLoading };
