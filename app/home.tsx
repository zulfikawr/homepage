'use client';

import React from 'react';
import EmploymentSection from '@/components/Section/Employment';
import ProjectSection from '@/components/Section/Project';
import InterestsAndObjectivesSection from '@/components/Section/InterestsAndObjectives';
import PersonalInfoSection from '@/components/Section/PersonalInfo';
import PostSection from '@/components/Section/Post';
import Banners from '@/components/Section/Banners';
import { useRealtimeData } from '@/hooks';
import { sectionsData } from '@/database/sections.client';
import { Section } from '@/types/section';
import { PersonalInfo } from '@/types/personalInfo';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Employment } from '@/types/employment';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';

interface HomeProps {
  initialData: {
    sections: Section[];
    personalInfo: PersonalInfo;
    posts: Post[];
    projects: Project[];
    employments: Employment[];
    interests: InterestsAndObjectives;
  };
}

export default function Home({ initialData }: HomeProps) {
  const { data: sections } = useRealtimeData(
    sectionsData,
    initialData.sections,
  );

  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': (
      <PersonalInfoSection initialData={initialData.personalInfo} />
    ),
    banners: <Banners />,
    interests: (
      <InterestsAndObjectivesSection initialData={initialData.interests} />
    ),
    projects: <ProjectSection initialData={initialData.projects} />,
    employment: <EmploymentSection initialData={initialData.employments} />,
    posts: <PostSection initialData={initialData.posts} />,
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
