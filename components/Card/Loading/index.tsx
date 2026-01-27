import { Skeleton } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';

const BaseCardLoading = ({ children }: { children: React.ReactNode }) => (
  <div className='relative flex w-full flex-col rounded-md border border-border bg-card shadow-sm dark:border-border'>
    {children}
  </div>
);

// Book: Exact mirror of BookCard
const BookCardLoading = () => (
  <BaseCardLoading>
    <div className='flex flex-1 items-center'>
      <div className='flex-shrink-0 px-4.5 py-4'>
        <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-muted dark:shadow-none dark:border-border'>
          <Skeleton width='100%' height='100%' />
        </div>
      </div>
      <div className='py-2 pr-4 space-y-1 flex-1'>
        <div className='h-5 flex items-center'>
          <Skeleton width='80%' height={14} as='span' />
        </div>
        <div className='h-4 flex items-center'>
          <Skeleton width='60%' height={12} as='span' />
        </div>
      </div>
    </div>
    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2 h-8 dark:border-border'>
      <Skeleton width={60} height={10} as='span' />
      <Skeleton width={40} height={10} as='span' />
    </div>
  </BaseCardLoading>
);

// Employment: Exact mirror of EmploymentCard
const EmploymentCardLoading = () => (
  <BaseCardLoading>
    <div className='min-w-[18rem] lg:min-w-[25rem]'>
      <div className='text-normal flex w-full items-center justify-between gap-x-2.5 overflow-hidden border-b border-border px-4.5 py-2.5 dark:border-border'>
        <div className='flex items-center gap-x-2'>
          <Skeleton width={24} height={24} variant='circle' as='span' />
          <Skeleton width={100} height={16} as='span' />
        </div>
        <Skeleton width={80} height={20} className='rounded-full' as='span' />
      </div>
      <div className='flex items-center justify-between gap-x-2.5 px-4.5 py-3'>
        <Skeleton width={120} height={16} as='span' />
        <Skeleton width={80} height={14} as='span' />
      </div>
      <div className='flex items-center justify-between border-t border-border px-4.5 py-1.5 dark:border-border w-full'>
        <Skeleton width={100} height={14} as='span' />
        <Skeleton width={60} height={18} className='rounded-full' as='span' />
      </div>
    </div>
  </BaseCardLoading>
);

// Project: Exact mirror of ProjectCard
const ProjectCardLoading = () => (
  <BaseCardLoading>
    {/* Mobile layout image */}
    <div className='relative h-48 w-full flex-shrink-0 overflow-hidden rounded-t-md sm:hidden'>
      <Skeleton width='100%' height='100%' />
    </div>

    {/* Desktop layout */}
    <div className='flex flex-1 flex-col p-4 sm:flex-row sm:items-center sm:gap-6'>
      {/* Desktop image container */}
      <div className='relative hidden h-32 w-56 flex-shrink-0 overflow-hidden rounded-md sm:block'>
        <Skeleton width='100%' height='100%' />
      </div>

      {/* Main content container */}
      <div className='flex w-full flex-col justify-between gap-4 sm:min-h-[100px]'>
        <div className='border-b border-border pb-2 dark:border-border'>
          <div className='flex items-center h-7'>
            <Skeleton width={20} height={20} className='mr-3' as='span' />
            <Skeleton width='50%' height={20} as='span' />
          </div>
        </div>

        <div className='space-y-2'>
          <Skeleton width='100%' height={14} as='span' />
          <Skeleton width='80%' height={14} as='span' />
        </div>

        <div className='flex flex-wrap gap-2 border-t border-border pt-2.5 dark:border-border'>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              width={60}
              height={24}
              className='rounded-full'
              as='span'
            />
          ))}
        </div>
      </div>
    </div>
  </BaseCardLoading>
);

// Post: Exact mirror of PostCard
const PostCardLoading = () => (
  <BaseCardLoading>
    <div className='flex p-6 gap-6 lg:p-8 lg:gap-8'>
      <div className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border border-border dark:border-border'>
        <Skeleton width='100%' height='100%' />
      </div>

      <div className='flex flex-col space-y-4 flex-1'>
        <div className='flex items-center h-7'>
          <div className='flex flex-wrap gap-3'>
            <Skeleton width={80} height={24} className='rounded-md' as='span' />
          </div>
        </div>

        <div className='h-8 flex items-center'>
          <Skeleton width='90%' height={24} as='span' />
        </div>

        <div className='space-y-2'>
          <Skeleton width='100%' height={16} as='span' />
          <Skeleton width='100%' height={16} as='span' />
          <Skeleton width='60%' height={16} as='span' />
        </div>
      </div>
    </div>

    <div className='h-auto w-full border-t border-border px-6 py-2 lg:px-8 lg:py-3 dark:border-border'>
      <div className='flex items-center justify-between h-8'>
        <Skeleton width={120} height={14} as='span' />
        <Skeleton width={60} height={14} as='span' />
      </div>
    </div>
  </BaseCardLoading>
);

// Playlist: Exact mirror of PlaylistCard
const PlaylistCardLoading = () => (
  <BaseCardLoading>
    <div className='grid grid-cols-4 items-center gap-4 p-4'>
      <div className='col-span-1 flex justify-center aspect-square'>
        <div className='w-20 h-20 rounded-md border border-border dark:border-border'>
          <Skeleton width='100%' height='100%' className='rounded-md' />
        </div>
      </div>
      <div className='col-span-3 space-y-1'>
        <div className='h-5 flex items-center'>
          <Skeleton width='75%' height={14} as='span' />
        </div>
        <div className='h-4 flex items-center'>
          <Skeleton width='60%' height={12} as='span' />
        </div>
        <div className='h-4 flex items-center'>
          <Skeleton width='40%' height={12} as='span' />
        </div>
      </div>
    </div>
    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2 h-8 dark:border-border'>
      <div className='flex items-center space-x-1'>
        <Skeleton width={18} height={18} variant='circle' as='span' />
        <Skeleton width={40} height={10} as='span' />
      </div>
      <Skeleton width={60} height={10} as='span' />
    </div>
  </BaseCardLoading>
);

// Certificate: Exact mirror of CertificateCard
const CertificateCardLoading = () => (
  <BaseCardLoading>
    <div className='block md:hidden'>
      <div className='w-full'>
        <div className='w-full aspect-video'>
          <Skeleton width='100%' height='100%' className='rounded-t-md' />
        </div>
        <div className='flex w-full border-b border-border px-4 py-3 dark:border-border'>
          <Skeleton width='75%' height={20} as='span' />
        </div>
        <div className='p-4 space-y-1'>
          <div className='flex items-center space-x-2 h-4'>
            <Skeleton width={14} height={14} variant='circle' as='span' />
            <Skeleton width={100} height={12} as='span' />
          </div>
          <Skeleton width={120} height={12} as='span' />
          <Skeleton width={180} height={16} className='rounded' as='span' />
        </div>
      </div>
    </div>

    <div className='hidden md:grid md:grid-cols-4 items-center gap-4 p-4'>
      <div className='col-span-1 flex justify-center aspect-video'>
        <Skeleton width='100%' height='100%' className='rounded-md' />
      </div>
      <div className='col-span-3 space-y-2'>
        <div className='h-6 flex items-center'>
          <Skeleton width='70%' height={18} as='span' />
        </div>
        <Separator margin='2' />
        <div className='flex items-center space-x-2 h-4'>
          <Skeleton width={14} height={14} variant='circle' as='span' />
          <Skeleton width={100} height={12} as='span' />
        </div>
        <div className='flex items-center space-x-2 h-4'>
          <Skeleton width={80} height={12} as='span' />
          <span className='text-muted-foreground font-light text-xs'>|</span>
          <Skeleton width={120} height={12} as='span' />
        </div>
      </div>
    </div>

    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2 h-8 dark:border-border'>
      <Skeleton width={60} height={10} as='span' />
      <Skeleton width={30} height={10} as='span' />
    </div>
  </BaseCardLoading>
);

// Publication: Exact mirror of PublicationCard
const PublicationCardLoading = () => (
  <BaseCardLoading>
    <div className='p-4 space-y-2'>
      <div className='h-6 flex items-center'>
        <Skeleton width='90%' height={18} as='span' />
      </div>
      <div className='h-5 flex items-center'>
        <Skeleton width='60%' height={14} as='span' />
      </div>
      <div className='flex flex-wrap gap-2 pt-2'>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            width={60}
            height={20}
            className='rounded-full'
            as='span'
          />
        ))}
      </div>
    </div>

    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2 h-8 dark:border-border'>
      <Skeleton width={80} height={10} as='span' />
      <div className='flex items-center gap-2'>
        <Skeleton width={18} height={18} variant='circle' as='span' />
        <Skeleton width={80} height={10} as='span' />
      </div>
    </div>
  </BaseCardLoading>
);

// Track: Mirror of the inline track layout in app/music/content.tsx
const TrackCardLoading = () => (
  <div className='flex items-center gap-4 py-4 px-2 md:px-6'>
    <span className='hidden md:flex w-5 h-5 items-center justify-center'>
      <Skeleton width={12} height={12} as='span' />
    </span>
    <div className='flex-shrink-0'>
      <Skeleton width={48} height={48} className='rounded-md' />
    </div>
    <div className='min-w-0 flex-1 space-y-2'>
      <div className='h-5 flex items-center'>
        <Skeleton width='40%' height={14} as='span' />
      </div>
      <div className='h-4 flex items-center'>
        <Skeleton width='30%' height={12} as='span' />
      </div>
    </div>
    <div className='flex-shrink-0'>
      <Skeleton width={40} height={12} as='span' />
    </div>
  </div>
);

// Movie: Exact mirror of MovieCard
const MovieCardLoading = ({ isInForm = false }: { isInForm?: boolean }) => {
  if (isInForm) {
    return (
      <BaseCardLoading>
        <div className='flex flex-1 items-center'>
          <div className='flex-shrink-0 px-4.5 py-4'>
            <div className='h-[52px] w-[35px] overflow-hidden rounded-sm border shadow-sm shadow-muted dark:shadow-none dark:border-border'>
              <Skeleton width='100%' height='100%' />
            </div>
          </div>
          <div className='py-2 pr-4 space-y-1 flex-1'>
            <div className='h-5 flex items-center'>
              <Skeleton width='70%' height={14} as='span' />
            </div>
            <div className='h-4 flex items-center'>
              <Skeleton width='50%' height={12} as='span' />
            </div>
          </div>
        </div>
        <Separator margin='0' />
        <div className='flex items-center gap-2 px-4.5 py-2 h-8'>
          <Skeleton width={40} height={10} as='span' />
          <div className='flex items-center gap-0.5'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                width={12}
                height={12}
                variant='circle'
                as='span'
              />
            ))}
          </div>
        </div>
      </BaseCardLoading>
    );
  }

  return (
    <BaseCardLoading>
      <div className='relative h-auto w-full lg:h-[196px] aspect-[2/3] lg:aspect-auto overflow-hidden'>
        <Skeleton width='100%' height='100%' className='rounded-t-md' />
      </div>
      <div className='flex w-full items-center justify-center px-1 py-2 gap-0.5 h-8'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} width={14} height={14} variant='circle' as='span' />
        ))}
      </div>
    </BaseCardLoading>
  );
};

type CardLoadingProps = {
  type:
    | 'book'
    | 'employment'
    | 'project'
    | 'post'
    | 'playlist'
    | 'certificate'
    | 'publication'
    | 'track'
    | 'movie';
  isInForm?: boolean;
};

const CardLoading = ({ type, isInForm }: CardLoadingProps) => {
  switch (type) {
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
    case 'movie':
      return <MovieCardLoading isInForm={isInForm} />;
    default:
      return <ProjectCardLoading />;
  }
};

export { CardLoading };
