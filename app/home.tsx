import React, { Suspense } from 'react';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import Banners from '@/components/section/banners';
import EmploymentSection, {
  EmploymentLayout,
} from '@/components/section/employment';
import InterestsAndObjectivesSection, {
  InterestsAndObjectivesLayout,
} from '@/components/section/interests-and-objectives';
import PersonalInfoSection, {
  PersonalInfoLayout,
} from '@/components/section/personal-info';
import PostSection, { PostLayout } from '@/components/section/post';
import ProjectSection, { ProjectLayout } from '@/components/section/project';
import {
  getEmployments,
  getInterestsAndObjectives,
  getPosts,
  getProfile,
  getProjects,
  getSections,
} from '@/lib/data';

// Standardized Skeletons using the Layout components
const PersonalInfoSkeleton = () => <PersonalInfoLayout isLoading={true} />;
const InterestsSkeleton = () => (
  <InterestsAndObjectivesLayout isLoading={true} />
);
const PostSkeleton = () => <PostLayout isLoading={true} />;
const ProjectSkeleton = () => <ProjectLayout isLoading={true} />;
const EmploymentSkeleton = () => <EmploymentLayout isLoading={true} />;

// Fetchers
async function PersonalInfoData() {
  const data = await getProfile();
  return <PersonalInfoSection data={data?.[0]} />;
}

async function InterestsData() {
  const data = await getInterestsAndObjectives();
  const selected =
    data.length > 0 ? data[Math.floor(Math.random() * data.length)] : undefined;
  return <InterestsAndObjectivesSection data={selected} />;
}

async function ProjectsData() {
  const data = await getProjects();
  return <ProjectSection data={data} />;
}

async function EmploymentData() {
  const data = await getEmployments();
  return <EmploymentSection data={data} />;
}

async function PostsData() {
  const data = await getPosts();
  return <PostSection data={data} />;
}

export default async function Home() {
  const allSections = await getSections();
  const sections = [...allSections].sort((a, b) => a.order - b.order);

  const sectionMap: Record<string, React.ReactNode> = {
    'personal-info': (
      <Suspense fallback={<PersonalInfoSkeleton />}>
        <PersonalInfoData />
      </Suspense>
    ),
    banners: <Banners />,
    interests: (
      <Suspense fallback={<InterestsSkeleton />}>
        <InterestsData />
      </Suspense>
    ),
    projects: (
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectsData />
      </Suspense>
    ),
    employment: (
      <Suspense fallback={<EmploymentSkeleton />}>
        <EmploymentData />
      </Suspense>
    ),
    posts: (
      <Suspense fallback={<PostSkeleton />}>
        <PostsData />
      </Suspense>
    ),
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
      ? sections.filter((s) => s.enabled)
      : defaultOrder.map((name, index) => ({
          name,
          enabled: true,
          order: index,
        }));

  return (
    <section className='mt-0 pt-24 lg:pt-12 space-y-14'>
      <StaggerContainer>
        {activeSections.map((section) => (
          <ViewTransition key={section.name}>
            {sectionMap[section.name]}
          </ViewTransition>
        ))}
      </StaggerContainer>
    </section>
  );
}
