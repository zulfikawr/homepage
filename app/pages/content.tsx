'use client';

import { StaggerContainer, ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Shimmer } from '@/components/ui/shimmer';
import NavigationCard from '@/components/ui/card/variants/navigation';
import { IconName } from '@/components/ui/icon';
import { Resume } from '@/types/resume';

export function PagesSkeleton() {
  return (
    <Shimmer loading>
      <PagesContent resume={null} />
    </Shimmer>
  );
}

export default function PagesContent({ resume }: { resume: Resume | null }) {
  const pages: { title: string; desc: string; icon: IconName; href: string }[] =
    [
      {
        title: 'Analytics',
        desc: 'Page views and analytics',
        icon: 'chartLine',
        href: '/analytics',
      },
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
        href: '/posts',
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
        icon: 'filePdf',
        href: resume?.file_url || '#',
      },
      {
        title: 'UI',
        desc: 'Explore UI components',
        icon: 'layout',
        href: '/ui',
      },
    ];

  const colors = [
    'text-destructive',
    'text-theme-orange',
    'text-theme-yellow',
    'text-theme-green',
    'text-theme-aqua',
    'text-theme-blue',
    'text-primary',
    'text-muted-foreground',
  ];

  return (
    <div>
      <PageTitle
        emoji='📑'
        title='Pages'
        subtitle='Explore all pages in this website'
      />

      <div className='grid grid-cols-2 gap-4'>
        <StaggerContainer>
          {pages
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((page, index) => {
              const colorIndex = (index * 7) % colors.length;
              return (
                <ViewTransition key={index}>
                  <NavigationCard
                    title={page.title}
                    desc={page.desc}
                    icon={page.icon}
                    className={colors[colorIndex]}
                    href={page.href}
                  />
                </ViewTransition>
              );
            })}
        </StaggerContainer>
      </div>
    </div>
  );
}
