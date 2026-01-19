'use client';

import NavigationCard from '@/components/Card/Navigation';
import PageTitle from '@/components/PageTitle';
import { IconName } from '@/components/UI/Icon';

export default function PagesContent() {
  const pages: { title: string; desc: string; icon: IconName; href: string }[] =
    [
      {
        title: 'Certifications',
        desc: 'Certs and licences',
        icon: 'certificate',
        href: '/certs',
      },
      {
        title: 'Contacts',
        desc: 'Get in touch',
        icon: 'addressBook',
        href: '/contacts',
      },
      {
        title: 'Feedback',
        desc: 'Share your thoughts',
        icon: 'chatCenteredText',
        href: '/feedback',
      },
      {
        title: 'Movies',
        desc: 'My watched movies list',
        icon: 'playCircle',
        href: '/movies',
      },
      {
        title: 'Music',
        desc: 'My music stats',
        icon: 'musicNotes',
        href: '/music',
      },
      {
        title: 'Posts',
        desc: 'Browse my posts',
        icon: 'note',
        href: '/post',
      },
      {
        title: 'Projects',
        desc: 'See my work',
        icon: 'package',
        href: '/projects',
      },
      {
        title: 'Publications',
        desc: 'Read my publications',
        icon: 'newspaper',
        href: '/publications',
      },
      {
        title: 'Reading List',
        desc: 'Books I love',
        icon: 'bookOpen',
        href: '/reading-list',
      },
      {
        title: 'Resume',
        desc: 'View my CV',
        icon: 'file',
        href: '/documents/resume.pdf',
      },
      {
        title: 'UI',
        desc: 'Explore UI components',
        icon: 'layout',
        href: '/ui',
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
    'text-muted-foreground',
    'text-violet-500',
  ];

  return (
    <div>
      <PageTitle
        emoji='📑'
        title='Pages'
        subtitle='Explore all pages in this website'
      />

      <div className='grid grid-cols-2 gap-4'>
        {pages
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((page, index) => {
            const colorIndex = (index * 7) % colors.length;
            return (
              <NavigationCard
                key={index}
                title={page.title}
                desc={page.desc}
                icon={page.icon}
                className={colors[colorIndex]}
                href={page.href}
              />
            );
          })}
      </div>
    </div>
  );
}
