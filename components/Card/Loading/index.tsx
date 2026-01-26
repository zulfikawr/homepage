import { Skeleton } from '@/components/UI';
import { Separator } from '@/components/UI/Separator';

const BaseCardLoading = ({ children }: { children: React.ReactNode }) => (
  <div className='relative flex w-full flex-col rounded-md border border-border bg-card shadow-sm'>
    <div className='animate-pulse'>{children}</div>
  </div>
);

// Book: Small image + Title + Author + Footer
const BookCardLoading = () => (
  <BaseCardLoading>
    <div className='flex flex-1 items-center h-[84px]'>
      {/* Book cover */}
      <div className='flex-shrink-0 px-4.5 py-4'>
        <Skeleton width={35} height={52} className='rounded-sm' />
      </div>

      {/* Content */}
      <div className='py-2 pr-4 space-y-2 flex-1'>
        <Skeleton width='60%' height={16} />
        <Skeleton width='40%' height={12} />
      </div>
    </div>

    {/* Footer: Info + Rating */}
    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-3'>
      <Skeleton width={64} height={12} />
      <Skeleton width={64} height={12} />
    </div>
  </BaseCardLoading>
);

// Employment: Header (logo + org + location) + Job details + Footer
const EmploymentCardLoading = () => (
  <BaseCardLoading>
    <div className='min-w-[18rem] lg:min-w-[25rem]'>
      {/* Header */}
      <div className='flex w-full items-center justify-between gap-x-2.5 border-b border-border px-4.5 py-2.5'>
        <div className='flex items-center gap-x-2'>
          <Skeleton width={24} height={24} variant='circle' />
          <Skeleton width={120} height={20} />
        </div>
        <Skeleton width={80} height={20} className='rounded-full' />
      </div>

      {/* Job details */}
      <div className='flex items-center justify-between gap-x-2.5 px-4.5 py-4'>
        <Skeleton width={160} height={14} />
        <Skeleton width={100} height={14} />
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between border-t border-border px-4.5 py-[10px]'>
        <Skeleton width={130} height={12} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
  </BaseCardLoading>
);

// Project: Image (mobile/desktop) + Name + Description + Tools
const ProjectCardLoading = () => (
  <BaseCardLoading>
    <div className='w-full'>
      {/* Mobile image */}
      <Skeleton height={192} className='w-full rounded-t-md sm:hidden' />

      <div className='flex flex-1 flex-col p-4 sm:flex-row sm:items-center sm:gap-6'>
        {/* Desktop image */}
        <Skeleton
          width={224}
          height={128}
          className='hidden sm:block rounded-md flex-shrink-0'
        />

        <div className='flex w-full flex-col justify-between gap-4 sm:min-h-[100px]'>
          <div className='border-b border-border pb-2'>
            <Skeleton width='50%' height={28} />
          </div>

          <div className='space-y-2'>
            <Skeleton width='100%' height={14} />
            <Skeleton width='80%' height={14} />
          </div>

          <div className='flex flex-wrap gap-2 border-t border-border pt-2.5'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} width={60} height={24} className='rounded-md' />
            ))}
          </div>
        </div>
      </div>
    </div>
  </BaseCardLoading>
);

// Post: Image (optional) + Categories + Title + Excerpt + Footer
const PostCardLoading = () => (
  <BaseCardLoading>
    <div className='flex p-6 gap-6 lg:p-8 lg:gap-8'>
      <Skeleton
        width={120}
        height={180}
        className='hidden sm:block rounded-md flex-shrink-0 lg:w-[150px] lg:h-[200px]'
      />

      <div className='flex flex-1 flex-col space-y-4 min-w-0'>
        <div className='flex gap-3'>
          <Skeleton width={80} height={24} />
          <Skeleton width={80} height={24} />
        </div>

        <Skeleton width='90%' height={32} />

        <div className='space-y-2'>
          <Skeleton width='100%' height={16} />
          <Skeleton width='100%' height={16} />
          <Skeleton width='60%' height={16} />
        </div>
      </div>
    </div>

    <div className='h-auto w-full border-t border-border px-6 py-2 lg:px-8 lg:py-3'>
      <div className='flex items-center justify-between'>
        <Skeleton width={120} height={16} />
        <Skeleton width={60} height={16} />
      </div>
    </div>
  </BaseCardLoading>
);

// Playlist: Image + Name + Description + Track count + Footer
const PlaylistCardLoading = () => (
  <BaseCardLoading>
    <div className='grid grid-cols-4 items-center gap-4 p-4'>
      <div className='col-span-1 flex justify-center aspect-square'>
        <Skeleton width={80} height={80} className='rounded-md' />
      </div>

      <div className='col-span-3 space-y-2'>
        <Skeleton width='75%' height={20} />
        <Skeleton width='60%' height={16} />
        <Skeleton width={80} height={16} />
      </div>
    </div>

    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2'>
      <Skeleton width={100} height={12} />
      <Skeleton width={80} height={12} />
    </div>
  </BaseCardLoading>
);

// Certificate: Image + Title + Organization + Issued date + Credential ID
const CertificateCardLoading = () => (
  <BaseCardLoading>
    <div className='block md:hidden'>
      <Skeleton height={200} className='w-full rounded-t-md' />
      <div className='border-b border-border px-4 py-3'>
        <Skeleton width='75%' height={20} />
      </div>
      <div className='p-4 space-y-3'>
        <div className='flex items-center space-x-2'>
          <Skeleton width={14} height={14} variant='circle' />
          <Skeleton width={100} height={12} />
        </div>
        <Skeleton width={120} height={12} />
        <Skeleton width={180} height={16} />
      </div>
    </div>

    <div className='hidden md:grid md:grid-cols-4 items-center gap-4 p-4'>
      <div className='col-span-1 flex justify-center aspect-video'>
        <Skeleton width='100%' height={80} className='rounded-md' />
      </div>
      <div className='col-span-3 space-y-3'>
        <Skeleton width='70%' height={24} />
        <Separator margin='2' />
        <div className='flex items-center space-x-2'>
          <Skeleton width={14} height={14} variant='circle' />
          <Skeleton width={100} height={12} />
        </div>
        <div className='flex items-center gap-2'>
          <Skeleton width={100} height={12} />
          <Skeleton width={150} height={16} />
        </div>
      </div>
    </div>

    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2'>
      <Skeleton width={80} height={12} />
      <Skeleton width={40} height={12} />
    </div>
  </BaseCardLoading>
);

// Publication: Title + Authors + Keywords + Footer (Publisher + Access)
const PublicationCardLoading = () => (
  <BaseCardLoading>
    <div className='p-4 space-y-3 h-[120px]'>
      <Skeleton width='90%' height={24} />
      <Skeleton width='60%' height={16} />
      <div className='flex flex-wrap gap-2 pt-1'>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} width={60} height={20} className='rounded-md' />
        ))}
      </div>
    </div>

    <div className='flex w-full items-center justify-between border-t border-border px-4.5 py-2'>
      <Skeleton width={100} height={12} />
      <Skeleton width={120} height={12} />
    </div>
  </BaseCardLoading>
);

// Track: Number + Album art + Title + Artist + Duration
const TrackCardLoading = () => (
  <BaseCardLoading>
    <div className='flex items-center space-x-4 p-3 h-[72px]'>
      <Skeleton width={24} height={16} />
      <Skeleton width={48} height={48} className='rounded-md' />
      <div className='flex-1 space-y-2'>
        <Skeleton width='70%' height={16} />
        <Skeleton width='40%' height={12} />
      </div>
      <Skeleton width={40} height={12} />
    </div>
  </BaseCardLoading>
);

// Movie: Image + Title + Rating (for form mode) OR Image + Rating (for view mode)
const MovieCardLoading = () => (
  <BaseCardLoading>
    <div className='h-[196px] w-full'>
      <Skeleton height='100%' className='rounded-t-md' />
    </div>
    <div className='flex w-full items-center justify-center px-1 py-2 gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} width={16} height={16} variant='circle' />
      ))}
    </div>
  </BaseCardLoading>
);

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
};

const CardLoading = ({ type }: CardLoadingProps) => {
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
      return <MovieCardLoading />;
    default:
      return <ProjectCardLoading />;
  }
};

export { CardLoading };
