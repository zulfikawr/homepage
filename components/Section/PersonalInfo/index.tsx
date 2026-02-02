'use client';

import { useMemo } from 'react';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Skeleton } from '@/components/UI';
import { useCollection } from '@/hooks';
import { mapRecordToPersonalInfo } from '@/lib/mappers';
import { PersonalInfo } from '@/types/personalInfo';

export const PersonalInfoLayout = ({
  personalInfo,
  isLoading = false,
}: {
  personalInfo?: PersonalInfo;
  isLoading?: boolean;
}) => {
  return (
    <section className='flex flex-row items-start justify-between gap-x-4 sm:gap-x-10'>
      <div className='flex flex-col gap-y-1 flex-1 min-w-0'>
        <h1 className='text-3xl lg:text-4xl font-medium tracking-wide text-foreground h-12 leading-[48px] flex items-center justify-start'>
          <span className='mr-3 flex items-center justify-center h-full'>👋</span>
          {isLoading ? (
            <Skeleton width={220} height={32} className='max-w-[70%]' />
          ) : (
            <span className='text-gruv-orange truncate'>{personalInfo?.name}</span>
          )}
        </h1>
        <div className='flex flex-col items-start gap-y-1.5 break-words px-1 text-sm font-light text-gruv-aqua dark:text-gruv-aqua squiggly-underline lg:text-lg min-h-6'>
          {isLoading ? (
            <Skeleton width={200} height={20} className='max-w-full' />
          ) : (
            <p className='text-gruv-aqua dark:text-gruv-aqua/80 text-left'>
              {personalInfo?.title}
            </p>
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
            src={personalInfo?.avatarUrl || ''}
            height={105}
            width={105}
            alt={personalInfo?.name || ''}
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

const PersonalInfoSection = () => {
  const {
    data: personalInfoList,
    loading,
    error,
  } = useCollection<PersonalInfo>('profile', mapRecordToPersonalInfo);

  const personalInfo = useMemo(() => {
    return personalInfoList && personalInfoList.length > 0
      ? personalInfoList[0]
      : undefined;
  }, [personalInfoList]);

  if (error) return <div>Failed to load personal info</div>;

  if (loading) {
    return <PersonalInfoLayout isLoading={true} />;
  }

  return <PersonalInfoLayout personalInfo={personalInfo} isLoading={false} />;
};

export default PersonalInfoSection;
