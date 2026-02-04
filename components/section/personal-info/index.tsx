'use client';

import ImageWithFallback from '@/components/image-with-fallback';
import { Skeleton } from '@/components/ui';
import { useLoadingToggle } from '@/contexts/loading-context';
import { PersonalInfo } from '@/types/personal-info';

export const PersonalInfoLayout = ({
  personalInfo,
  isLoading = false,
}: {
  personalInfo?: PersonalInfo;
  isLoading?: boolean;
}) => {
  const name = personalInfo?.name || 'Zulfikar';
  const title = personalInfo?.title || 'I build things for the web';
  const avatar = personalInfo?.avatar || '/avatar.jpg';

  return (
    <section className='flex flex-row items-start justify-between gap-x-4 sm:gap-x-10'>
      <div className='flex flex-col gap-y-1 flex-1 min-w-0'>
        <h1 className='text-3xl lg:text-4xl font-medium tracking-wide text-foreground h-12 leading-[48px] flex items-center justify-start'>
          <span className='mr-3 flex items-center justify-center h-full'>
            👋
          </span>
          {isLoading ? (
            <Skeleton width={220} height={32} className='max-w-[70%]' />
          ) : (
            <span className='text-primary truncate'>{name}</span>
          )}
        </h1>
        <div className='flex flex-col items-start gap-y-1.5 break-words px-1 text-sm font-light text-primary/80 dark:text-primary/80 squiggly-underline lg:text-lg min-h-6'>
          {isLoading ? (
            <Skeleton width={200} height={20} className='max-w-full' />
          ) : (
            <p className='text-accent text-left'>{title}</p>
          )}
        </div>
      </div>
      <div className='block flex-shrink-0 pt-1'>
        {isLoading ? (
          <Skeleton
            width={105}
            height={105}
            className='rounded-xl shadow-brutalist border-2 border-border'
          />
        ) : (
          <ImageWithFallback
            src={avatar}
            height={105}
            width={105}
            alt={name}
            preload
            className='bg-muted aspect-square object-cover border-2 border-border shadow-brutalist rounded-xl'
            type='square'
            sizes='105px'
          />
        )}
      </div>
    </section>
  );
};

export default function PersonalInfoSection({ data }: { data?: PersonalInfo }) {
  const { forceLoading } = useLoadingToggle();

  if (forceLoading) {
    return <PersonalInfoLayout isLoading={true} />;
  }

  return <PersonalInfoLayout personalInfo={data} isLoading={false} />;
}
