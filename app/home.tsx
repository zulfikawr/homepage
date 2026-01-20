'use client';

import React from 'react';
import EmploymentSection from '@/components/Section/Employment';
import ProjectSection from '@/components/Section/Project';
import InterestsAndObjectivesSection from '@/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '@/components/Section/PersonalInfo';
import PostSection from '@/components/Section/Post';
import Banners from '@/components/Section/Banners';
import { useCollection } from '@/hooks';
import { mapRecordToSection } from '@/lib/mappers';
import { Section } from '@/types/section';

export default function Home() {
  const options = React.useMemo(() => ({ sort: 'order' }), []);
  const { data: sections } = useCollection<Section>(
    'sections',
    mapRecordToSection,
    options,
  );

  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': <PersonalInfoSection />,
    banners: <Banners />,
    interests: <InterestsAndObjectivesSection />,
    projects: <ProjectSection />,
    employment: <EmploymentSection />,
    posts: <PostSection />,
  };

  const defaultOrder = [
    'personal-info',
    'banners',
    'interests',
    'projects',
    'employment',
    'posts',
  ];

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
