'use client';

import { useMemo } from 'react';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Hover } from '@/components/Visual';
import { useCollection } from '@/hooks';
import { mapRecordToPersonalInfo } from '@/lib/mappers';
import { PersonalInfo } from '@/types/personalInfo';

import Loading from './loading';

const PersonalInfoSection = () => {
  const {
    data: personalInfoList,
    loading,
    error,
  } = useCollection<PersonalInfo>('profile', mapRecordToPersonalInfo);

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
  if (loading) return <Loading />;

  return (
    <section className='flex items-center justify-between gap-x-10 gap-y-8'>
      <div className='flex flex-col gap-y-1'>
        <h1 className='text-4xl font-medium tracking-wide text-foreground'>
          <span className='mr-3 inline-block'>👋</span>
          {personalInfo.name}
        </h1>
        <div className='flex flex-col gap-y-1.5 break-words px-1 text-sm font-light leading-relaxed text-muted-foreground dark:text-muted-foreground lg:text-lg'>
          <p>{personalInfo.title}</p>
        </div>
      </div>
      <Hover
        perspective={1000}
        max={25}
        scale={1.01}
        className='block flex-shrink-0 pt-1'
      >
        <ImageWithFallback
          src={personalInfo.avatarUrl}
          height={105}
          width={105}
          alt={personalInfo.name}
          priority
          className='bg-muted shadow-sm dark:border dark:border-border aspect-square object-cover'
          type='square'
        />
      </Hover>
    </section>
  );
};

export default PersonalInfoSection;
