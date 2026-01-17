import { Separator } from '@/components/UI/Separator';

const BaseCardLoading = ({ children }: { children: React.ReactNode }) => (
  <div className='relative flex w-full flex-col rounded-md border bg-white shadow-sm dark:border-border dark:bg-card'>
    <div className='animate-pulse'>{children}</div>
  </div>
);

// Book: Small image + Title + Author + Footer
const BookCardLoading = () => (
  <BaseCardLoading>
    <div className='flex flex-1 items-center'>
      {/* Book cover */}
      <div className='flex-shrink-0 px-4.5 py-4'>
        <div className='h-[52px] w-[35px] rounded-sm bg-muted dark:bg-muted' />
      </div>

      {/* Content */}
      <div className='py-2 pr-4 space-y-2'>
        {/* Title */}
        <div className='h-4 w-24 md:w-40 rounded bg-muted dark:bg-muted' />

        {/* Author */}
        <div className='h-3 w-16 md:w-32 rounded bg-muted dark:bg-muted' />
      </div>
    </div>

    {/* Footer: Info + Rating */}
    <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-3 dark:border-border'>
      <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
      <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
    </div>
  </BaseCardLoading>
);

// Employment: Header (logo + org + location) + Job details + Footer
const EmploymentCardLoading = () => (
  <BaseCardLoading>
    <>
      {/* Header */}
      <div className='flex w-full min-w-[18rem] lg:min-w-[25rem] items-center justify-between gap-x-2.5 border-b border-border px-4.5 py-2.5 dark:border-border'>
        <div className='flex items-center gap-x-2'>
          {/* Logo */}
          <div className='h-[24px] w-[24px] rounded-full bg-muted dark:bg-muted' />
          {/* Organization name */}
          <div className='h-5 w-32 rounded bg-muted dark:bg-muted' />
        </div>
        {/* Location badge */}
        <div className='h-5 w-24 rounded-full border bg-muted dark:border-neutral-600 dark:bg-muted' />
      </div>

      {/* Job details */}
      <div className='flex items-center justify-between gap-x-2.5 px-4.5 py-4'>
        {/* Job title */}
        <div className='h-[14px] w-40 rounded bg-muted dark:bg-muted' />
        {/* Date range */}
        <div className='h-[14px] w-24 rounded bg-muted dark:bg-muted' />
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between border-t border-border px-4.5 py-[10px] dark:border-border'>
        <div className='h-[12px] w-32 rounded bg-muted dark:bg-muted' />
        <div className='h-[12px] w-20 rounded bg-muted dark:bg-muted' />
      </div>
    </>
  </BaseCardLoading>
);

// Project: Image (mobile/desktop) + Name + Description + Tools
const ProjectCardLoading = () => (
  <BaseCardLoading>
    <>
      {/* Mobile image */}
      <div className='relative h-48 w-full flex-shrink-0 rounded-t-md bg-muted dark:bg-muted sm:hidden' />

      <div className='flex flex-1 flex-col items-center gap-4 p-4 sm:flex-row'>
        {/* Desktop image */}
        <div className='relative hidden h-32 w-56 flex-shrink-0 rounded-md bg-muted dark:bg-muted sm:block' />

        <div className='flex w-full flex-col justify-between gap-y-2'>
          {/* Project name */}
          <div className='h-7 w-3/4 rounded bg-muted dark:bg-muted' />

          <Separator margin='1' />

          {/* Description (2 lines) */}
          <div className='space-y-2'>
            <div className='h-4 w-full rounded bg-muted dark:bg-muted' />
            <div className='h-4 w-5/6 rounded bg-muted dark:bg-muted' />
          </div>

          <Separator margin='1' />

          {/* Tools/tags */}
          <div className='flex flex-wrap gap-2'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-6 w-16 rounded-full bg-muted dark:bg-muted'
              />
            ))}
          </div>
        </div>
      </div>
    </>
  </BaseCardLoading>
);

// Post: Image (optional) + Categories + Title + Excerpt + Footer
const PostCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='flex gap-6 p-6 lg:gap-8 lg:p-8'>
        {/* Featured image (optional) */}
        <div className='h-[180px] w-[120px] flex-shrink-0 rounded-md bg-muted dark:bg-muted sm:h-[200px] sm:w-[150px]' />

        <div className='flex flex-1 flex-col space-y-4'>
          {/* Categories */}
          <div className='flex flex-wrap items-center gap-3'>
            <div className='h-6 w-16 rounded-md bg-muted dark:bg-muted' />
            <div className='h-6 w-16 rounded-md bg-muted dark:bg-muted' />
          </div>

          {/* Title */}
          <div className='h-8 w-3/4 rounded bg-muted dark:bg-muted' />

          {/* Excerpt (2 lines) */}
          <div className='space-y-2'>
            <div className='h-4 w-full rounded bg-muted dark:bg-muted' />
            <div className='h-4 w-5/6 rounded bg-muted dark:bg-muted' />
          </div>
        </div>
      </div>

      {/* Footer: Posted time + Share button */}
      <div className='h-auto w-full border-t border-neutral-100 px-6 py-2 dark:border-border lg:px-8 lg:py-3'>
        <div className='flex items-center justify-between whitespace-nowrap text-muted-foreground'>
          <div className='h-4 w-32 rounded bg-muted dark:bg-muted' />
          <div className='h-4 w-16 rounded bg-muted dark:bg-muted' />
        </div>
      </div>
    </>
  </BaseCardLoading>
);

// Playlist: Image + Name + Description + Track count + Footer
const PlaylistCardLoading = () => (
  <BaseCardLoading>
    <>
      <div className='grid grid-cols-4 items-center gap-4 p-4'>
        {/* Playlist image */}
        <div className='col-span-1 flex justify-center aspect-square'>
          <div className='h-20 w-20 rounded-md bg-muted dark:bg-muted' />
        </div>

        {/* Playlist info */}
        <div className='col-span-3 space-y-1'>
          {/* Name */}
          <div className='h-5 w-3/4 rounded bg-muted dark:bg-muted' />

          {/* Description */}
          <div className='h-4 w-2/3 rounded bg-muted dark:bg-muted' />

          {/* Track count */}
          <div className='h-4 w-20 rounded bg-muted dark:bg-muted' />
        </div>
      </div>

      {/* Footer: Spotify + Listen now */}
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-muted-foreground dark:border-border dark:text-neutral-400'>
        <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
        <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
      </div>
    </>
  </BaseCardLoading>
);

// Certificate: Image + Title + Organization + Issued date + Credential ID
const CertificateCardLoading = () => (
  <BaseCardLoading>
    <>
      {/* Mobile layout */}
      <div className='block md:hidden'>
        {/* Image */}
        <div className='w-full aspect-video bg-muted dark:bg-muted' />

        {/* Title */}
        <div className='w-full border-b border-neutral-100 px-4 py-3 dark:border-border'>
          <div className='h-5 w-3/4 rounded bg-muted dark:bg-muted' />
        </div>

        {/* Details */}
        <div className='p-4 space-y-2'>
          <div className='flex items-center space-x-2'>
            <div className='h-3 w-3 rounded-full bg-muted dark:bg-muted' />
            <div className='h-4 w-24 rounded bg-muted dark:bg-muted' />
          </div>
          <div className='h-4 w-32 rounded bg-muted dark:bg-muted' />
          <div className='h-4 w-40 rounded bg-muted dark:bg-muted' />
        </div>
      </div>

      {/* Desktop layout */}
      <div className='hidden md:grid md:grid-cols-4 items-center gap-4 p-4'>
        {/* Image */}
        <div className='col-span-1 flex justify-center aspect-video'>
          <div className='h-20 w-full rounded-md bg-muted dark:bg-muted' />
        </div>

        {/* Details */}
        <div className='col-span-3 space-y-2'>
          {/* Title */}
          <div className='h-5 w-3/4 rounded bg-muted dark:bg-muted' />

          <Separator margin='2' />

          {/* Organization + Issued date + Credential ID */}
          <div className='space-y-2'>
            <div className='h-4 w-1/2 rounded bg-muted dark:bg-muted' />
            <div className='h-4 w-2/3 rounded bg-muted dark:bg-muted' />
            <div className='h-4 w-40 rounded bg-muted dark:bg-muted' />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4.5 py-2 text-xs font-light text-muted-foreground dark:border-border dark:text-neutral-400'>
        <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
        <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
      </div>
    </>
  </BaseCardLoading>
);

// Publication: Title + Authors + Keywords + Footer (Publisher + Access)
const PublicationCardLoading = () => (
  <BaseCardLoading>
    <div className='p-4 space-y-2'>
      {/* Title */}
      <div className='h-6 w-3/4 rounded bg-muted dark:bg-muted' />

      {/* Authors */}
      <div className='h-4 w-1/2 rounded bg-muted dark:bg-muted' />

      {/* Keywords/Tags */}
      <div className='flex flex-wrap gap-2 pt-2'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-6 w-16 rounded bg-muted dark:bg-muted' />
        ))}
      </div>
    </div>

    {/* Footer: Publisher + Access status */}
    <div className='flex w-full items-center justify-between border-t border-neutral-100 px-4 py-2 text-xs font-light text-muted-foreground dark:border-border dark:text-neutral-400'>
      <div className='h-3 w-16 rounded bg-muted dark:bg-muted' />
      <div className='h-3 w-20 rounded bg-muted dark:bg-muted' />
    </div>
  </BaseCardLoading>
);

// Track: Number + Album art + Title + Artist + Duration
const TrackCardLoading = () => (
  <BaseCardLoading>
    <div className='flex items-center space-x-4 p-3'>
      {/* Track number */}
      <div className='h-4 w-6 rounded bg-muted dark:bg-muted' />

      {/* Album art */}
      <div className='h-12 w-12 rounded-md bg-muted dark:bg-muted' />

      {/* Title + Artist */}
      <div className='flex-1 space-y-2'>
        <div className='h-4 w-3/4 rounded bg-muted dark:bg-muted' />
        <div className='h-3 w-1/2 rounded bg-muted dark:bg-muted' />
      </div>

      {/* Duration */}
      <div className='h-3 w-10 rounded bg-muted dark:bg-muted' />
    </div>
  </BaseCardLoading>
);

// Movie: Image + Title + Rating (for form mode) OR Image + Rating (for view mode)
const MovieCardLoading = () => (
  <BaseCardLoading>
    <>
      {/* Image */}
      <div className='relative h-full overflow-hidden group'>
        <div className='h-[196px] w-full rounded-t-md bg-muted dark:bg-muted' />
      </div>

      {/* Rating stars */}
      <div className='flex w-full items-center justify-center px-1 py-2 gap-0.5'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='h-4 w-4 rounded bg-muted dark:bg-muted' />
        ))}
      </div>
    </>
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
