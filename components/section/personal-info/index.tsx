'use client';

import ImageWithFallback from '@/components/image-with-fallback';
import { Shimmer } from '@/components/ui/shimmer';
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
  const avatar = personalInfo?.avatar || '/images/avatar.jpg';

  return (
    <Shimmer loading={isLoading}>
      <section className='flex flex-row items-start justify-between gap-x-4 sm:gap-x-10'>
        <div className='flex flex-col gap-y-1 flex-1 min-w-0'>
          <h1 className='text-3xl lg:text-4xl font-medium tracking-wide text-foreground h-12 leading-[48px] flex items-center justify-start'>
            <span className='mr-3 flex items-center justify-center h-full'>
              👋
            </span>
            <span className='text-primary truncate'>{name}</span>
          </h1>
          <div className='flex flex-col items-start gap-y-1.5 break-words px-1 text-sm font-light text-primary/80 dark:text-primary/80 lg:text-lg min-h-6'>
            <p className='text-accent text-left squiggly-underline w-fit'>
              {title}
            </p>
          </div>
        </div>
        <div className='block flex-shrink-0 pt-1'>
          <ImageWithFallback
            src={avatar}
            height={105}
            width={105}
            alt={name}
            preload
            fetchPriority='high'
            className='bg-muted aspect-square object-cover border-2 border-border shadow-brutalist rounded-xl'
            type='square'
            sizes='105px'
          />
        </div>
      </section>
    </Shimmer>
  );
};

export default function PersonalInfoSection({ data }: { data?: PersonalInfo }) {
  const { forceLoading } = useLoadingToggle();

  if (forceLoading) {
    return <PersonalInfoLayout isLoading={true} />;
  }

  return <PersonalInfoLayout personalInfo={data} isLoading={false} />;
}
