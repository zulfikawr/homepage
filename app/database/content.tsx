'use client';

import PageTitle from '@/components/PageTitle';
import NavigationCard from '@/components/Card/Navigation';
import { IconName } from '@/components/UI/Icon';

export default function DatabaseContent() {
  const databaseCategories: {
    title: string;
    desc: string;
    icon: IconName;
    href: string;
  }[] = [
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
      title: 'Resume',
      desc: 'Update your resume',
      icon: 'filePdf',
      href: '/database/resume',
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
    {
      title: 'Sections',
      desc: 'Manage homepage sections',
      icon: 'rows',
      href: '/database/sections',
    },
  ];

  const colors = [
    'text-gruv-orange',
    'text-yellow-500',
    'text-green-500',
    'text-teal-500',
    'text-blue-500',
    'text-indigo-500',
    'text-gruv-aqua',
    'text-pink-500',
    'text-muted-foreground',
    'text-violet-500',
    'text-rose-500',
  ];

  return (
    <div>
      <PageTitle
        emoji='🗃️'
        title='Database'
        subtitle='Manage all database-related content on the website'
      />

      <div className='grid grid-cols-2 gap-4'>
        {databaseCategories.map((category, index) => {
          // Use a deterministic "shuffle" based on index
          const colorIndex = (index * 7) % colors.length;
          return (
            <NavigationCard
              key={index}
              title={category.title}
              desc={category.desc}
              icon={category.icon}
              className={colors[colorIndex]}
              href={category.href}
            />
          );
        })}
      </div>
    </div>
  );
}
