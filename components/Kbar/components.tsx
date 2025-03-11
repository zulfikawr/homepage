'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from 'contexts/authContext';
import { useEffect, useState, useRef, useMemo } from 'react';
import Tabs, { type TabItemProps } from 'components/Tabs';
import { drawer } from 'components/Drawer';
import { useRouteInfo } from '@/hooks/useRouteInfo';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Input } from '../UI';

interface MenuSection {
  label: string;
  items: TabItemProps[];
}

export function KbarContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [, setSelectedIndex] = useState(0);
  const { confirmLogout } = useAuthActions();
  const containerRef = useRef<HTMLDivElement>(null);

  const { isHomePage } = useRouteInfo();

  const allItems: MenuSection[] = useMemo(
    () => [
      {
        label: 'Pages',
        items: [
          !isHomePage
            ? {
                key: 'back',
                label: 'Go Back',
                action: () => router.back(),
                icon: 'arrowLeft',
              }
            : {
                key: 'home',
                label: 'Home',
                action: () => router.push('/'),
                icon: 'houseLine',
              },
          {
            key: 'contacts',
            label: 'Contacts',
            action: () => router.push('/contacts'),
            icon: 'addressBook',
          },
          {
            key: 'dashboard',
            label: 'Dashboard',
            action: () => router.push('/dashboard'),
            icon: 'presentationChart',
          },
          {
            key: 'feedback',
            label: 'Feedback',
            action: () => router.push('/feedback'),
            icon: 'chatCenteredText',
          },
          {
            key: 'playlist',
            label: 'Playlist',
            action: () => router.push('/playlist'),
            icon: 'musicNotes',
          },
          {
            key: 'podcast',
            label: 'Podcast',
            action: () => router.push('/podcast'),
            icon: 'microphone',
          },
          {
            key: 'post',
            label: 'Post',
            action: () => router.push('/post'),
            icon: 'note',
          },
          {
            key: 'projects',
            label: 'Projects',
            action: () => router.push('/projects'),
            icon: 'package',
          },
          {
            key: 'reading-list',
            label: 'Reading List',
            action: () => router.push('/reading-list'),
            icon: 'bookOpen',
          },
          {
            key: 'schedule',
            label: 'Schedule a Meeting',
            action: () => router.push('/schedule'),
            icon: 'calendarPlus',
          },
          {
            key: 'resume',
            label: 'Resume',
            action: () => router.push('/documents/resume.pdf'),
            icon: 'file',
          },
          {
            key: 'ui',
            label: 'UI Components',
            action: () => router.push('/ui'),
            icon: 'layout',
          },
        ],
      },
      {
        label: 'Theme',
        items: [
          {
            key: 'theme-dark',
            label: 'Switch to Dark Theme',
            action: () => setTheme('dark'),
            hidden: resolvedTheme === 'dark',
            icon: 'moon',
          },
          {
            key: 'theme-light',
            label: 'Switch to Light Theme',
            action: () => setTheme('light'),
            hidden: resolvedTheme === 'light',
            icon: 'sun',
          },
          {
            key: 'theme-system',
            label: 'Use System Theme',
            action: () => setTheme('system'),
            icon: 'desktop',
          },
        ],
      },
      {
        label: 'Social',
        items: [
          {
            key: 'twitter',
            label: 'Twitter',
            action: () => window.open('https://x.com/ttttonyhe', '_blank'),
            icon: 'x',
          },
          {
            key: 'github',
            label: 'GitHub',
            action: () => window.open('https://github.com/zulfikawr', '_blank'),
            icon: 'github',
          },
          {
            key: 'linkedin',
            label: 'LinkedIn',
            action: () =>
              window.open(
                'https://www.linkedin.com/in/zulfikar-muhammad',
                '_blank',
              ),
            icon: 'linkedin',
          },
          {
            key: 'email',
            label: 'Email',
            action: () => {
              window.location.href = 'mailto:zulfikawr@gmail.com';
            },
            icon: 'envelope',
          },
        ],
      },
      {
        label: 'Account',
        items: user
          ? [
              {
                key: 'create-post',
                label: 'Create Post',
                action: () => router.push('/post/create'),
                icon: 'edit',
              },
              {
                key: 'logout',
                label: 'Logout',
                action: () => confirmLogout(),
                icon: 'signOut',
              },
            ]
          : [
              {
                key: 'login',
                label: 'Login',
                action: () => router.push('/login'),
                icon: 'signIn',
              },
            ],
      },
    ],
    [resolvedTheme, user, isHomePage, router, setTheme, confirmLogout],
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

  const tabItems: TabItemProps[] = useMemo(
    () =>
      filteredSections.flatMap((section) => [
        {
          key: section.label,
          sectionLabel: section.label,
        },
        ...section.items.map((item) => ({
          key: item.key,
          label: item.label,
          action: () => {
            if (item.action) {
              item.action();
              drawer.close();
            }
          },
          icon: item.icon,
        })),
      ]),
    [filteredSections],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <div className='flex h-full flex-col pt-4 px-4'>
      <div className='flex items-center gap-2 border-b pb-4 dark:border-gray-700'>
        <Input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Type to search...'
          autoFocus
        />
      </div>
      <div className='flex-1 overflow-auto py-4 relative' ref={containerRef}>
        <Tabs
          items={tabItems}
          defaultHighlighted
          verticalListWrapper={containerRef}
          direction='vertical'
        />
      </div>
    </div>
  );
}
