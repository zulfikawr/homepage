import React from 'react';
import { personalInfoData } from '@/database/personalInfo';
import Loading from './loading';
import { Hover } from '@/components/Visual';
import { useRealtimeData } from '@/hooks';
import ImageWithFallback from '@/components/ImageWithFallback';

const PersonalInfoSection = () => {
  const {
    data: personalInfo,
    loading,
    error,
  } = useRealtimeData(personalInfoData);

  if (error) return <div>Failed to load personal info</div>;
  if (loading) return <Loading />;

  return (
    <section className='flex items-center justify-between gap-x-10 gap-y-8'>
      <div className='flex flex-col gap-y-1'>
        <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
          <span className='mr-3 inline-block'>👋</span>
          {personalInfo.name}
        </h1>
        <div className='flex flex-col gap-y-1.5 break-words px-1 text-4 font-light leading-relaxed text-neutral-500 dark:text-neutral-300 lg:text-2'>
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
          className='bg-neutral-200 shadow-sm dark:border dark:border-neutral-600 aspect-square object-cover'
          type='square'
        />
      </Hover>
    </section>
  );
};

export default PersonalInfoSection;
