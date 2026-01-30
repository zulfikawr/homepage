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
    <section className='flex items-center justify-between gap-x-10 gap-y-8'>
      <div className='flex flex-col gap-y-1 flex-1'>
        <h1 className='text-4xl font-medium tracking-wide text-foreground h-12 leading-[48px]'>
          <span className='mr-3 inline-block'>👋</span>
          {isLoading ? (
            <Skeleton width={192} height={32} as='span' />
          ) : (
            <span className='text-gruv-orange'>{personalInfo?.name}</span>
          )}
        </h1>
        <div className='flex flex-col gap-y-1.5 break-words px-1 text-sm font-light text-gruv-aqua dark:text-gruv-aqua squiggly-underline lg:text-lg'>
          {isLoading ? (
            <Skeleton width={256} height={20} as='span' />
          ) : (
            <p className='text-gruv-aqua dark:text-gruv-aqua/80'>
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

const PersonalInfoSection = ({
  initialData,
}: {
  initialData?: PersonalInfo[];
}) => {
  const {
    data: personalInfoList,
    loading,
    error,
  } = useCollection<PersonalInfo>(
    'profile',
    mapRecordToPersonalInfo,
    {},
    initialData,
  );

  const personalInfo = useMemo(() => {
    return personalInfoList && personalInfoList.length > 0
      ? personalInfoList[0]
      : {
          name: 'Zulfikar',
          title: 'I build things for the web',
          avatarUrl: '/images/placeholder-square.png',
        };
  }, [personalInfoList]);

  if (error) return <div>Failed to load personal info</div>;

  return <PersonalInfoLayout personalInfo={personalInfo} isLoading={loading} />;
};

export default PersonalInfoSection;
