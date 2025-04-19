'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/authContext';
import { useEffect, useState, useRef, useMemo } from 'react';
import { drawer } from '@/components/Drawer';
import { useRouteInfo } from '@/hooks/useRouteInfo';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Button, Input } from '@/components/UI';
import { Icon } from '@/components/UI';
import SectionTitle from '@/components/SectionTitle';
import Separator from '@/components/UI/Separator';

export function KbarContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { confirmLogout } = useAuthActions();
  const { isHomePage } = useRouteInfo();

  const allItems = useMemo(
    () => [
      {
        label: 'Pages',
        icon: 'folder',
        items: [
          !isHomePage
            ? {
                key: 'back',
                label: 'Go Back',
                desc: 'Return to previous page',
                action: () => router.back(),
                icon: 'arrowLeft',
              }
            : {
                key: 'home',
                label: 'Home',
                desc: 'Return to homepage',
                action: () => router.push('/'),
                icon: 'houseLine',
              },
          {
            key: 'contacts',
            label: 'Contacts',
            desc: 'View my contact information',
            action: () => router.push('/contacts'),
            icon: 'addressBook',
          },
          {
            key: 'dashboard',
            label: 'Dashboard',
            desc: 'View personal dashboard',
            action: () => router.push('/dashboard'),
            icon: 'presentationChart',
          },
          {
            key: 'feedback',
            label: 'Feedback',
            desc: 'Share your thoughts',
            action: () => router.push('/feedback'),
            icon: 'chatCenteredText',
          },
          {
            key: 'music',
            label: 'Music',
            desc: 'Browse my spotify stats',
            action: () => router.push('/music'),
            icon: 'musicNotes',
          },
          {
            key: 'podcast',
            label: 'Podcast',
            desc: 'My recommended podcasts',
            action: () => router.push('/podcast'),
            icon: 'microphone',
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
        label: 'Theme',
        icon: 'palette',
        items: [
          {
            key: 'theme-dark',
            label: 'Switch to Dark Theme',
            desc: 'Enable dark mode',
            action: () => setTheme('dark'),
            hidden: resolvedTheme === 'dark',
            icon: 'moon',
          },
          {
            key: 'theme-light',
            label: 'Switch to Light Theme',
            desc: 'Enable light mode',
            action: () => setTheme('light'),
            hidden: resolvedTheme === 'light',
            icon: 'sun',
          },
          {
            key: 'theme-system',
            label: 'Use System Theme',
            desc: 'Match system appearance',
            action: () => setTheme('system'),
            icon: 'desktop',
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
            icon: 'github',
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
            icon: 'linkedin',
          },
          {
            key: 'whatsapp',
            label: 'WhatsApp',
            desc: 'Text me on WhatsApp',
            action: () => window.open('https://wa.me/+6285156453730', '_blank'),
            icon: 'whatsapp',
          },
        ],
      },
      {
        label: 'Account',
        icon: 'userCircle',
        items: user
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
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <Icon name='menu' className='size-[28px] md:size-[32px]' />
            <h1 className='text-xl md:text-2xl font-semibold'>Navigation</h1>
          </div>
          <Button icon='close' onClick={() => drawer.close()} />
        </div>
      </div>

      <Separator margin='0' />

      <div className='hidden md:block px-8 pt-8 pb-0'>
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
                <div
                  key={item.key}
                  onClick={() => handleAction(item.action)}
                  className='relative flex cursor-pointer items-center rounded-md border bg-white px-4 pb-4 pt-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:shadow-none select-none'
                >
                  <div className='relative z-10 flex items-center overflow-hidden w-full'>
                    {item.icon && (
                      <div className='mr-3 flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-700'>
                        <Icon name={item.icon} className='size-5' />
                      </div>
                    )}
                    <div className='w-full'>
                      <h1 className='text-md md:text-2 font-medium tracking-wide line-clamp-1 text-ellipsis'>
                        {item.label}
                      </h1>
                      {item.desc && (
                        <p className='text-xs md:text-sm tracking-wide text-neutral-600 dark:text-neutral-400 line-clamp-1 text-ellipsis'>
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
