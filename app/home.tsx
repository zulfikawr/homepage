'use client';

import React, { useEffect } from 'react';
import { incrementPageViews } from '@/database/analytics';
import PagesAndLinks from '@/components/Banners/PagesAndLinks';
import EmploymentSection from '@/components/Section/Employment';
import ProjectSection from '@/components/Section/Project';
import InterestsAndObjectivesSection from '@/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '@/components/Section/PersonalInfo';
import PostSection from '@/components/Section/Post';
import CurrentlyListening from '@/components/Banners/CurrentlyListening';
import LocationAndTime from '@/components/Banners/LocationAndTime';
import { useRealtimeData } from '@/hooks';
import { sectionsData } from '@/database/sections';

export default function Home() {
  useEffect(() => {
    incrementPageViews('/root');
  }, []);

  const { data: sections, loading } = useRealtimeData(sectionsData);

  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': <PersonalInfoSection />,
    highlights: (
      <div className='space-y-6'>
        <PagesAndLinks />
        <div className='flex flex-col sm:grid sm:grid-cols-2 gap-6'>
          <CurrentlyListening />
          <LocationAndTime />
        </div>
      </div>
    ),
    interests: <InterestsAndObjectivesSection />,
    projects: <ProjectSection />,
    employment: <EmploymentSection />,
    posts: <PostSection />,
  };

  const defaultOrder = [
    'personal-info',
    'highlights',
    'interests',
    'projects',
    'employment',
    'posts',
  ];

  if (loading) {
    return (
      <section className='mt-0 pt-24 lg:pt-12 space-y-14 animate-pulse'>
        <div className='h-40 w-full bg-neutral-100 dark:bg-neutral-800 rounded-md' />
        <div className='h-40 w-full bg-neutral-100 dark:bg-neutral-800 rounded-md' />
        <div className='h-40 w-full bg-neutral-100 dark:bg-neutral-800 rounded-md' />
      </section>
    );
  }

  const activeSections =
    sections && sections.length > 0
      ? sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order)
      : defaultOrder.map((name, index) => ({
          name,
          enabled: true,
          order: index,
        }));

  return (
    <section className='mt-0 pt-24 lg:pt-12 space-y-14'>
      {activeSections.map((section) => (
        <React.Fragment key={section.name}>
          {sectionMap[section.name]}
        </React.Fragment>
      ))}
    </section>
  );
}
