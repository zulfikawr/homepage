'use client';

import React from 'react';
import { useAuth } from '@/contexts/authContext';
import PageTitle from '@/components/PageTitle';
import NavigationCard from '@/components/Card/Navigation';
import { drawer } from '@/components/Drawer';
import { personalInfoData } from '@/functions/personalInfo';
import { interestsAndObjectivesData } from '@/functions/interestsAndObjectives';
import { projectsData } from '@/functions/projects';
import PersonalInfoForm from '@/components/Form/PersonalInfo';
import ProjectsDrawer from '@/components/Drawer/Project';
import InterestsAndObjectivesForm from '@/components/Form/InterestsAndObjectives';
import EmploymentsDrawer from '@/components/Drawer/Employment';
import { employmentsData } from '@/functions/employments';
import PostsDrawer from '@/components/Drawer/Post';
import { postsData } from '@/functions/posts';
import BookDrawer from '@/components/Drawer/Book';
import { booksData } from '@/functions/books';
import PodcastDrawer from '@/components/Drawer/Podcast';
import { podcastsData } from '@/functions/podcasts';
import CertificateDrawer from '@/components/Drawer/Certificate';
import { certificatesData } from '@/functions/certificates';
import { useRealtimeData } from '@/hooks';

export default function DatabaseContent() {
  const { user } = useAuth();

  const { data: personalInfo } = useRealtimeData(personalInfoData);
  const { data: interestsAndObjectives } = useRealtimeData(
    interestsAndObjectivesData,
  );
  const { data: projects } = useRealtimeData(projectsData);
  const { data: employments } = useRealtimeData(employmentsData);
  const { data: posts } = useRealtimeData(postsData);
  const { data: books } = useRealtimeData(booksData);
  const { data: podcasts } = useRealtimeData(podcastsData);
  const { data: certificates } = useRealtimeData(certificatesData);

  const databaseCategories = [
    {
      title: 'Certifications',
      desc: 'Manage your licenses and certifications',
      icon: 'certificate',
      action: () =>
        drawer.open(<CertificateDrawer certificates={certificates} />),
    },
    {
      title: 'Employments',
      desc: 'Manage your employments',
      icon: 'briefcase',
      action: () =>
        drawer.open(<EmploymentsDrawer employments={employments} />),
    },
    {
      title: 'Interests & Objectives',
      desc: 'Manage your interests and objectives',
      icon: 'microscope',
      action: () =>
        drawer.open(
          <InterestsAndObjectivesForm data={interestsAndObjectives} />,
        ),
    },
    {
      title: 'Personal Info',
      desc: 'Manage your personal information',
      icon: 'userCircle',
      action: () => drawer.open(<PersonalInfoForm data={personalInfo} />),
    },
    {
      title: 'Podcasts',
      desc: 'Manage your podcasts',
      icon: 'microphone',
      action: () => drawer.open(<PodcastDrawer podcasts={podcasts} />),
    },
    {
      title: 'Posts',
      desc: 'Manage your posts',
      icon: 'note',
      action: () => drawer.open(<PostsDrawer posts={posts} />),
    },
    {
      title: 'Projects',
      desc: 'Manage your projects',
      icon: 'package',
      action: () => drawer.open(<ProjectsDrawer projects={projects} />),
    },
    {
      title: 'Reading Lists',
      desc: 'Manage your reading lists',
      icon: 'bookOpen',
      action: () => drawer.open(<BookDrawer books={books} />),
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
