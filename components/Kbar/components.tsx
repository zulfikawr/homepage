'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { useEffect, useState, useRef, useMemo } from 'react';
import { drawer } from '@/components/Drawer';
import { useAuthActions } from '@/hooks';
import { Input } from '@/components/UI';
import { Icon } from '@/components/UI';
import SectionTitle from '@/components/SectionTitle';
import { IconName } from '@/components/UI/Icon';
import NavigationCard from '@/components/Card/Navigation';

export function KbarContent() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { confirmLogout } = useAuthActions();

  const allItems: {
    label: string;
    icon: IconName;
    items: {
      key: string;
      label: string;
      desc: string;
      action: () => void;
      icon: IconName;
      hidden?: boolean;
    }[];
  }[] = useMemo(
    () => [
      {
        label: 'Pages',
        icon: 'folder',
        items: [
          {
            key: 'analytics',
            label: 'Analytics',
            desc: 'Page views and analytics',
            action: () => router.push('/analytics'),
            icon: 'chartLine',
          },
          {
            key: 'certifications',
            label: 'Certifications',
            desc: 'View my certs and license',
            action: () => router.push('/certs'),
            icon: 'certificate',
          },
          {
            key: 'contacts',
            label: 'Contacts',
            desc: 'View my contact information',
            action: () => router.push('/contacts'),
            icon: 'addressBook',
          },
          {
            key: 'feedback',
            label: 'Feedback',
            desc: 'Share your thoughts',
            action: () => router.push('/feedback'),
            icon: 'chatCenteredText',
          },
          {
            key: 'movies',
            label: 'Movies',
            desc: 'Browse my watched movies',
            action: () => router.push('/movies'),
            icon: 'playCircle',
          },
          {
            key: 'music',
            label: 'Music',
            desc: 'Browse my spotify stats',
            action: () => router.push('/music'),
            icon: 'musicNotes',
          },
          {
            key: 'post',
            label: 'Post',
            desc: 'Read my latest posts',
            action: () => router.push('/post'),
            icon: 'note',
          },
          {
            key: 'projects',
            label: 'Projects',
            desc: 'Explore my projects',
            action: () => router.push('/projects'),
            icon: 'package',
          },
          {
            key: 'publications',
            label: 'Publications',
            desc: 'Read my publications',
            action: () => router.push('/publications'),
            icon: 'newspaper',
          },
          {
            key: 'reading-list',
            label: 'Reading List',
            desc: 'My recommended reads',
            action: () => router.push('/reading-list'),
            icon: 'bookOpen',
          },
          {
            key: 'resume',
            label: 'Resume',
            desc: 'Download my resume',
            action: () => router.push('/documents/resume.pdf'),
            icon: 'file',
          },
          {
            key: 'ui',
            label: 'UI Components',
            desc: 'View UI components',
            action: () => router.push('/ui'),
            icon: 'layout',
          },
        ],
      },
      {
        label: 'Social',
        icon: 'shareNetwork',
        items: [
          {
            key: 'email',
            label: 'Email',
            desc: 'Send me an email',
            action: () => {
              window.location.href = 'mailto:zulfikawr@gmail.com';
            },
            icon: 'envelope',
          },
          {
            key: 'github',
            label: 'GitHub',
            desc: 'View my GitHub profile',
            action: () => window.open('https://github.com/zulfikawr', '_blank'),
            icon: 'githubLogo',
          },
          {
            key: 'linkedin',
            label: 'LinkedIn',
            desc: 'Connect on LinkedIn',
            action: () =>
              window.open(
                'https://www.linkedin.com/in/zulfikar-muhammad',
                '_blank',
              ),
            icon: 'linkedinLogo',
          },
          {
            key: 'whatsapp',
            label: 'WhatsApp',
            desc: 'Text me on WhatsApp',
            action: () => window.open('https://wa.me/+6285156453730', '_blank'),
            icon: 'whatsappLogo',
          },
        ],
      },
      {
        label: 'Account',
        icon: 'userCircle',
        items: isAdmin
          ? [
              {
                key: 'database',
                label: 'Database',
                desc: 'View database content',
                action: () => router.push('/database'),
                icon: 'database',
              },
              {
                key: 'logout',
                label: 'Logout',
                desc: 'Sign out of your account',
                action: () => confirmLogout(),
                icon: 'signOut',
              },
            ]
          : user
            ? [
                {
                  key: 'logout',
                  label: 'Logout',
                  desc: 'Sign out of your account',
                  action: () => confirmLogout(),
                  icon: 'signOut',
                },
              ]
            : [
                {
                  key: 'login',
                  label: 'Login',
                  desc: 'Sign in to your account',
                  action: () => router.push('/login'),
                  icon: 'signIn',
                },
              ],
      },
    ],
    [isAdmin, user, router, confirmLogout],
  );

  const filteredSections = useMemo(
    () =>
      allItems
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              !item.hidden &&
              item.label.toLowerCase().includes(search.toLowerCase()),
          ),
        }))
        .filter((section) => section.items.length > 0),
    [allItems, search],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAction = (action: () => void) => {
    action();
    drawer.close();
  };

  return (
    <div className='flex h-full flex-col'>
      <div className='px-4 pt-4 pb-0 sm:px-8 sm:pt-6 sm:pb-0'>
        <div className='relative'>
          <Icon
            name='magnifyingGlass'
            className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 size-5 z-10'
          />
          <Input
            ref={inputRef}
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Type to search...'
            className='pl-[2.5rem] w-full'
          />
        </div>
      </div>

      <div className='flex-1 overflow-y-auto flex-shrink-0 p-4 sm:px-8 sm:py-6 pt-6'>
        {filteredSections.map((section) => (
          <div key={section.label} className='mb-8'>
            <SectionTitle icon={section.icon} title={section.label} />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {section.items.map((item) => (
                <NavigationCard
                  key={item.key}
                  title={item.label}
                  desc={item.desc}
                  icon={item.icon}
                  action={() => handleAction(item.action)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
