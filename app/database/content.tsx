'use client';

import React from 'react';
import { useAuth } from '@/contexts/authContext';
import PageTitle from '@/components/PageTitle';
import NavigationCard from '@/components/Card/Navigation';
import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';
import { IconName } from '@/components/UI/Icon';

export default function DatabaseContent() {
  const { user } = useAuth();
  const router = useRouter();

  const databaseCategories: {
    title: string;
    desc: string;
    icon: IconName;
    href: string;
  }[] = [
    {
      title: 'Analytics',
      desc: 'Page views and analytics',
      icon: 'chartLine',
      href: '/analytics',
    },
    {
      title: 'Certifications',
      desc: 'Manage your licenses and certifications',
      icon: 'certificate',
      href: '/database/certs',
    },
    {
      title: 'Employments',
      desc: 'Manage your employments',
      icon: 'briefcase',
      href: '/database/employments',
    },
    {
      title: 'Feedback',
      desc: 'See feedback responses',
      icon: 'chatCenteredText',
      href: '/database/feedback',
    },
    {
      title: 'Interests & Objectives',
      desc: 'Manage your interests and objectives',
      icon: 'microscope',
      href: '/database/interests-and-objectives',
    },
    {
      title: 'Movies',
      desc: 'Manage your movie list',
      icon: 'playCircle',
      href: '/database/movies',
    },
    {
      title: 'Personal Info',
      desc: 'Manage your personal information',
      icon: 'userCircle',
      href: '/database/personal-info',
    },
    {
      title: 'Posts',
      desc: 'Manage your posts',
      icon: 'note',
      href: '/database/posts',
    },
    {
      title: 'Projects',
      desc: 'Manage your projects',
      icon: 'package',
      href: '/database/projects',
    },
    {
      title: 'Publications',
      desc: 'Manage your academic and professional publications',
      icon: 'newspaper',
      href: '/database/publications',
    },
    {
      title: 'Reading List',
      desc: 'Manage your reading list',
      icon: 'bookOpen',
      href: '/database/reading-list',
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
        <div className='w-full mx-auto rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
          <div className='px-6 py-10'>
            <p className='text-center text-lg dark:text-white'>
              You must be logged in to manage the database.
            </p>
            <div className='mt-4 flex justify-center space-x-4'>
              <Button type='primary' onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button onClick={() => router.push('/')}>Go to Home</Button>
            </div>
          </div>
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
              href={category.href}
            />
          ))}
        </div>
      )}
    </div>
  );
}
