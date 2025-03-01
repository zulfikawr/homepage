import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useAuth } from '~/contexts/authContext';
import { auth, signOut } from '~/lib/firebase';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Tabs, { type TabItemProps } from '~/components/Tabs';
import { drawer } from '../Drawer';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const isHomePage = router.pathname === '/';

  const handleAction = useCallback(
    async (action: string) => {
      const actionMap: {
        [key: string]: () => void | Promise<void> | Promise<boolean>;
      } = {
        // Navigation actions
        back: () => router.back(),
        goHome: () => router.push('/'),
        goAbout: () => router.push('/about'),
        goDashboard: () => router.push('/dashboard'),
        goReadingList: () => router.push('/reading-list'),
        goLogin: () => router.push('/login'),
        goFeedback: () => router.push('/feedback'),

        // Theme actions
        setDarkTheme: () => setTheme('dark'),
        setLightTheme: () => setTheme('light'),
        setSystemTheme: () => setTheme('system'),

        // Auth actions
        logout: async () => {
          await signOut(auth);
          await router.push('/');
        },
        goToCreatePost: () => router.push('/post/create'),

        // External links
        openAnalytics: () => {
          window.open(
            'https://analytics.ouorz.com/share/E4O9QpCn/ouorz-next',
            '_blank',
          );
          return void 0;
        },
        openThoughts: () => {
          window.open('https://notion.ouorz.com', '_blank');
          return void 0;
        },
        openTwitter: () => {
          window.open('https://x.com/ttttonyhe', '_blank');
          return void 0;
        },
        openGitHub: () => {
          window.open('https://github.com/zulfikawr', '_blank');
          return void 0;
        },
        openLinkedIn: () => {
          window.open(
            'https://www.linkedin.com/in/zulfikar-muhammad',
            '_blank',
          );
          return void 0;
        },

        // Email action
        email: () => {
          window.location.href = 'mailto:zulfikawr@gmail.com';
          return void 0;
        },
      };

      const actionFn = actionMap[action];
      if (actionFn) {
        await actionFn();
      }
    },
    [router, setTheme],
  );

  const allItems: MenuSection[] = useMemo(
    () => [
      {
        label: 'Navigation',
        items: [
          !isHomePage
            ? {
                id: 'back',
                label: 'Go Back',
                action: 'back',
                icon: 'left',
              }
            : {
                id: 'home',
                label: 'Home',
                action: 'goHome',
                icon: 'home',
              },
          {
            id: 'about',
            label: 'About',
            action: 'goAbout',
            icon: 'me',
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            action: 'goDashboard',
            icon: 'ppt',
          },
          {
            id: 'reading-list',
            label: 'Reading List',
            action: 'goReadingList',
            icon: 'bookOpen',
          },
          {
            id: 'comment',
            label: 'Feedback',
            action: 'goFeedback',
            icon: 'comments',
          },
        ],
      },
      {
        label: 'Theme',
        items: [
          {
            id: 'theme-dark',
            label: 'Switch to Dark Theme',
            action: 'setDarkTheme',
            hidden: resolvedTheme === 'dark',
            icon: 'moon',
          },
          {
            id: 'theme-light',
            label: 'Switch to Light Theme',
            action: 'setLightTheme',
            hidden: resolvedTheme === 'light',
            icon: 'sun',
          },
          {
            id: 'theme-system',
            label: 'Use System Theme',
            action: 'setSystemTheme',
            icon: 'monitor',
          },
        ],
      },
      {
        label: 'Account',
        items: user
          ? [
              {
                id: 'create-post',
                label: 'Create Post',
                action: 'goToCreatePost',
                icon: 'edit',
              },
              {
                id: 'logout',
                label: 'Logout',
                action: 'logout',
                icon: 'left',
              },
            ]
          : [
              {
                id: 'login',
                label: 'Login',
                action: 'goLogin',
                icon: 'left',
              },
            ],
      },
      {
        label: 'Links',
        items: [
          {
            id: 'analytics',
            label: 'Analytics',
            action: 'openAnalytics',
            icon: 'growth',
          },
          {
            id: 'thoughts',
            label: 'Thoughts',
            action: 'openThoughts',
            icon: 'lightBulb',
          },
        ],
      },
      {
        label: 'Social',
        items: [
          {
            id: 'twitter',
            label: 'Twitter',
            action: 'openTwitter',
            icon: 'twitterX',
          },
          {
            id: 'github',
            label: 'GitHub',
            action: 'openGitHub',
            icon: 'github',
          },
          {
            id: 'linkedin',
            label: 'LinkedIn',
            action: 'openLinkedIn',
            icon: 'linkedIn',
          },
          {
            id: 'email',
            label: 'Email',
            action: 'email',
            icon: 'email',
          },
        ],
      },
    ],
    [resolvedTheme, user, isHomePage],
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
          label: section.label,
          hoverable: false,
        },
        ...section.items.map((item) => ({
          label: item.label,
          onClick: () => handleAction(item.action) && drawer.close(),
          icon: item.icon,
        })),
      ]),
    [filteredSections, handleAction],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <div className='flex h-full flex-col pt-4 px-4'>
      <div className='flex items-center gap-2 border-b pb-4 dark:border-gray-700'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Type to search...'
          className='w-full rounded-md border border-gray-200 bg-white bg-opacity-90 px-3 py-2 text-sm text-gray-500 outline-none transition-shadow hover:bg-neutral-50 dark:border-gray-700 dark:bg-gray-800 dark:bg-opacity-50 dark:shadow-sm dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:bg-opacity-100'
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
