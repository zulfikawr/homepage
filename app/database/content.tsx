'use client';

import React from 'react';
import { useAuth } from '@/contexts/authContext';
import PageTitle from '@/components/PageTitle';
import NavigationCard from '@/components/Card/Navigation';
import { drawer } from '@/components/Drawer';
import { useFetchData } from '@/lib/fetchData';
import { getPersonalInfo } from '@/functions/personalInfo';
import { getProjects } from '@/functions/projects';
import PersonalInfoForm from '@/components/Form/PersonalInfo';
import ProjectsDrawer from '@/components/Drawer/Project';
import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import { getInterestsAndObjectives } from '@/functions/interestsAndObjectives';
import EmploymentsDrawer from '@/components/Drawer/Employment';
import { getEmployments } from '@/functions/employments';
import PostsDrawer from '@/components/Drawer/Post';
import { getPosts } from '@/functions/posts';
import BookDrawer from '@/components/Drawer/Book';
import { getBooks } from '@/functions/books';
import PodcastDrawer from '@/components/Drawer/Podcast';
import { getPodcasts } from '@/functions/podcasts';
import CertificateDrawer from '@/components/Drawer/Certificate';
import { getCertificates } from '@/functions/certificates';

export default function DatabaseContent() {
  const { user } = useAuth();

  const { data: personalInfo, refetch: refetchPersonalInfo } =
    useFetchData(getPersonalInfo);
  const {
    data: interestsAndObjectives,
    refetch: refetchInterestsAndObjectives,
  } = useFetchData(getInterestsAndObjectives);
  const { data: projects, refetch: refetchProjects } =
    useFetchData(getProjects);
  const { data: employments, refetch: refetchEmployments } =
    useFetchData(getEmployments);
  const { data: posts, refetch: refetchPosts } = useFetchData(getPosts);
  const { data: books, refetch: refetchBooks } = useFetchData(getBooks);
  const { data: podcasts, refetch: refetchPodcasts } =
    useFetchData(getPodcasts);
  const { data: certificates, refetch: refetchCertificates } =
    useFetchData(getCertificates);

  const databaseCategories = [
    {
      title: 'Certifications',
      desc: 'Manage your licenses and certifications',
      icon: 'certificate',
      action: () =>
        drawer.open(
          <CertificateDrawer
            certificates={certificates}
            onUpdate={refetchCertificates}
          />,
        ),
    },
    {
      title: 'Employments',
      desc: 'Manage your employments',
      icon: 'briefcase',
      action: () =>
        drawer.open(
          <EmploymentsDrawer
            employments={employments}
            onUpdate={refetchEmployments}
          />,
        ),
    },
    {
      title: 'Interests & Objectives',
      desc: 'Manage your interests and objectives',
      icon: 'microscope',
      action: () =>
        drawer.open(
          <InterestsAndObjectivesForm
            data={interestsAndObjectives}
            onUpdate={refetchInterestsAndObjectives}
          />,
        ),
    },
    {
      title: 'Personal Info',
      desc: 'Manage your personal information',
      icon: 'userCircle',
      action: () =>
        drawer.open(
          <PersonalInfoForm
            data={personalInfo}
            onUpdate={refetchPersonalInfo}
          />,
        ),
    },
    {
      title: 'Podcasts',
      desc: 'Manage your podcasts',
      icon: 'microphone',
      action: () =>
        drawer.open(
          <PodcastDrawer podcasts={podcasts} onUpdate={refetchPodcasts} />,
        ),
    },
    {
      title: 'Posts',
      desc: 'Manage your posts',
      icon: 'note',
      action: () =>
        drawer.open(<PostsDrawer posts={posts} onUpdate={refetchPosts} />),
    },
    {
      title: 'Projects',
      desc: 'Manage your projects',
      icon: 'package',
      action: () =>
        drawer.open(
          <ProjectsDrawer projects={projects} onUpdate={refetchProjects} />,
        ),
    },
    {
      title: 'Reading Lists',
      desc: 'Manage your reading lists',
      icon: 'bookOpen',
      action: () =>
        drawer.open(<BookDrawer books={books} onUpdate={refetchBooks} />),
    },
  ];

  const colors = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500',
    'text-teal-500',
    'text-blue-500',
    'text-indigo-500',
    'text-purple-500',
    'text-pink-500',
    'text-neutral-500',
    'text-violet-500',
  ];

  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

  return (
    <div>
      <PageTitle
        emoji='🗃️'
        title='Database'
        subtitle='Manage all database-related content on the website'
        route='/database'
      />

      {!user ? (
        <div className='text-center py-8'>
          <p className='text-neutral-500 dark:text-neutral-400'>
            You must be logged in to manage the database.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          {databaseCategories.map((category, index) => (
            <NavigationCard
              key={index}
              title={category.title}
              desc={category.desc}
              icon={category.icon}
              className={shuffledColors[index % shuffledColors.length]}
              action={category.action}
            />
          ))}
        </div>
      )}
    </div>
  );
}
