'use client';

import React, { useEffect } from 'react';
import { incrementPageViews } from '@/functions/analytics';
import PagesAndLinks from '@/components/Banners/PagesAndLinks';
import EmploymentSection from '@/components/Section/Employment';
import ProjectSection from '@/components/Section/Project';
import InterestsAndObjectivesSection from '@/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '@/components/Section/PersonalInfo';
import PostSection from '@/components/Section/Post';
import CurrentlyListening from '@/components/Banners/CurrentlyListening';
import LocationAndTime from '@/components/Banners/LocationAndTime';

export default function Home() {
  useEffect(() => {
    incrementPageViews('/root');
  }, []);

  return (
    <section className='mt-0 pt-24 lg:pt-12 space-y-14'>
      <PersonalInfoSection />

      <div className='space-y-6'>
        <PagesAndLinks />
        <div className='flex flex-col sm:grid sm:grid-cols-2 gap-6'>
          <CurrentlyListening />
          <LocationAndTime />
        </div>
      </div>

      <InterestsAndObjectivesSection />

      <ProjectSection />

      <EmploymentSection />

      <PostSection />
    </section>
  );
}
