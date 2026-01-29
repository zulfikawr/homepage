'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import SectionTitle from '@/components/SectionTitle';
import { drawer } from '@/components/UI';
import { Input } from '@/components/UI';
import { Icon } from '@/components/UI';
import BookCard from '@/components/UI/Card/variants/Book';
import NavigationCard from '@/components/UI/Card/variants/Navigation';
import PostCard from '@/components/UI/Card/variants/Post';
import ProjectCard from '@/components/UI/Card/variants/Project';
import { PublicationCard } from '@/components/UI/Card/variants/Publication';
import { IconName } from '@/components/UI/Icon';
import { useAuth } from '@/contexts/authContext';
import { searchDatabase, SearchResult } from '@/database/search';
import { useAuthActions } from '@/hooks';
import { useCollection } from '@/hooks';
import { mapRecordToResume } from '@/lib/mappers';
import { Book } from '@/types/book';
import { Post } from '@/types/post';
import { Project } from '@/types/project';
import { Publication } from '@/types/publication';
import { Resume } from '@/types/resume';
import { calculateRank } from '@/utilities/search';

type StaticKbarItem = {
  key: string;
  label: string;
  desc: string;
  action?: () => void;
  href?: string;
  icon: IconName;
  hidden?: boolean;
};

type DbKbarItem = {
  key: string;
  type: 'post' | 'project' | 'book' | 'publication';
  data: Post | Project | Book | Publication;
  action: () => void;
};

type KbarItem = StaticKbarItem | DbKbarItem;

type KbarSection = {
  label: string;
  icon: IconName;
  isDb?: boolean;
  items: KbarItem[];
};

export function KbarContent() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { data: resumeList } = useCollection<Resume>(
    'resume',
    mapRecordToResume,
  );

  const resume = useMemo(() => {
    return resumeList && resumeList.length > 0 ? resumeList[0] : null;
  }, [resumeList]);

  const [search, setSearch] = useState('');
  const [dbResults, setDbResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { confirmLogout } = useAuthActions();

  // Debounced search for database content
  useEffect(() => {
    if (search.length < 2) {
      setDbResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchDatabase(search);
        setDbResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const allItems: {
    label: string;
    icon: IconName;
    items: StaticKbarItem[];
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
            href: '/analytics',
            icon: 'chartLine',
          },
          {
            key: 'certifications',
            label: 'Certifications',
            desc: 'View my certs and license',
            href: '/certs',
            icon: 'certificate',
          },
          {
            key: 'contacts',
            label: 'Contacts',
            desc: 'View my contact information',
            href: '/contacts',
            icon: 'addressBook',
          },
          {
            key: 'feedback',
            label: 'Feedback',
            desc: 'Share your thoughts',
            href: '/feedback',
            icon: 'chatCenteredText',
          },
          {
            key: 'movies',
            label: 'Movies',
            desc: 'Browse my watched movies',
            href: '/movies',
            icon: 'playCircle',
          },
          {
            key: 'music',
            label: 'Music',
            desc: 'Browse my spotify stats',
            href: '/music',
            icon: 'musicNotes',
          },
          {
            key: 'post',
            label: 'Post',
            desc: 'Read my latest posts',
            href: '/posts',
            icon: 'note',
          },
          {
            key: 'projects',
            label: 'Projects',
            desc: 'Explore my projects',
            href: '/projects',
            icon: 'package',
          },
          {
            key: 'publications',
            label: 'Publications',
            desc: 'Read my publications',
            href: '/publications',
            icon: 'newspaper',
          },
          {
            key: 'reading-list',
            label: 'Reading List',
            desc: 'My recommended reads',
            href: '/reading-list',
            icon: 'bookOpen',
          },
          {
            key: 'resume',
            label: 'Resume',
            desc: 'Download my resume',
            action: () => {
              if (resume?.fileUrl) {
                window.open(resume.fileUrl, '_blank');
              }
            },
            icon: 'filePdf',
          },
          {
            key: 'ui',
            label: 'UI Components',
            desc: 'View UI components',
            href: '/ui',
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
                href: '/database',
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
                  href: '/login',
                  icon: 'signIn',
                },
              ],
      },
    ],
    [isAdmin, user, confirmLogout, resume],
  );

  const filteredSections = useMemo((): KbarSection[] => {
    if (search.trim() === '') {
      return allItems
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !item.hidden),
        }))
        .filter((section) => section.items.length > 0);
    }

    const staticSections: KbarSection[] = allItems
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => !item.hidden)
          .map((item) => ({
            ...item,
            score: calculateRank(item.label, item.desc, search),
          }))
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score),
      }))
      .filter((section) => section.items.length > 0);

    if (dbResults.length > 0) {
      const dbItemsWithScore = dbResults
        .map((res) => {
          let title = '';
          let secondary = '';
          if (res.type === 'post') {
            title = res.data.title;
            secondary = res.data.excerpt || res.data.content || '';
          } else if (res.type === 'project') {
            title = res.data.name;
            secondary = res.data.description || res.data.readme || '';
          } else if (res.type === 'book') {
            title = res.data.title;
            secondary = res.data.author || '';
          } else if (res.type === 'publication') {
            title = res.data.title;
            secondary = res.data.publisher || res.data.excerpt || '';
          }

          return {
            res,
            score: calculateRank(title, secondary, search),
          };
        })
        .filter((item) => item.score > 0);

      if (dbItemsWithScore.length > 0) {
        const typeMetadata: Record<string, { label: string; icon: IconName }> =
          {
            post: { label: 'Posts', icon: 'note' },
            project: { label: 'Projects', icon: 'package' },
            book: { label: 'Reading List', icon: 'bookOpen' },
            publication: { label: 'Publications', icon: 'newspaper' },
          };

        const grouped = dbItemsWithScore.reduce(
          (acc, item) => {
            const type = item.res.type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(item);
            return acc;
          },
          {} as Record<string, typeof dbItemsWithScore>,
        );

        const dbSections: KbarSection[] = Object.entries(grouped)
          .map(([type, items]) => ({
            label: typeMetadata[type].label,
            icon: typeMetadata[type].icon,
            isDb: true,
            items: items
              .sort((a, b) => b.score - a.score)
              .map(({ res }) => ({
                key: `db-${res.type}-${res.data.id}`,
                type: res.type,
                data: res.data,
                action: () => {},
              })),
            maxScore: Math.max(...items.map((i) => i.score)),
          }))
          .sort((a, b) => b.maxScore - a.maxScore)
          .map((s) => {
            return Object.keys(s)
              .filter((key) => key !== 'maxScore')
              .reduce((obj, key) => {
                obj[key] = s[key];
                return obj;
              }, {} as KbarSection);
          });

        return [...dbSections, ...staticSections];
      }
    }

    return staticSections;
  }, [allItems, search, dbResults]);

  const flattenedItems = useMemo(
    () => filteredSections.flatMap((section) => section.items),
    [filteredSections],
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search, dbResults]);

  useEffect(() => {
    if (inputRef.current) {
      // Only focus on non-mobile devices to prevent automatic keyboard popup
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        inputRef.current.focus();
      }
    }
  }, []);

  const handleAction = (item: StaticKbarItem) => {
    if (item.action) {
      item.action();
      drawer.close();
    } else if (item.href) {
      router.push(item.href);
      drawer.close();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < flattenedItems.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = flattenedItems[selectedIndex];
      if (selectedItem) {
        if ('type' in selectedItem) {
          const res = selectedItem as DbKbarItem;
          if (res.type === 'post') {
            router.push(`/posts/${res.data.slug || res.data.id}`);
            drawer.close();
          } else if (res.type === 'project') {
            router.push(`/projects/${res.data.slug || res.data.id}`);
            drawer.close();
          } else if (res.type === 'book' || res.type === 'publication') {
            if ('link' in res.data) {
              window.open(res.data.link, '_blank');
              drawer.close();
            }
          }
        } else {
          handleAction(selectedItem as StaticKbarItem);
        }
      }
    }
  };

  // Scroll into view logic
  useEffect(() => {
    const selectedElement = scrollRef.current?.querySelector(
      `[data-selected="true"]`,
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  return (
    <div className='flex h-full flex-col'>
      <div className='px-4 pt-4 pb-0 sm:px-8 sm:pt-6 sm:pb-0'>
        <div className='relative'>
          <Icon
            name={isSearching ? 'circleNotch' : 'magnifyingGlass'}
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-gruv-aqua size-5 z-10 ${isSearching ? 'animate-spin' : ''}`}
          />
          <Input
            ref={inputRef}
            className='w-full bg-muted/50 dark:bg-card border-none rounded-none px-12 py-6 text-lg focus:ring-0 placeholder:text-muted-foreground transition-all duration-200'
            placeholder='What do you need?'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto flex-shrink-0 p-4 sm:px-8 sm:py-6 pt-6'
      >
        {filteredSections.length === 0 && !isSearching ? (
          <div className='flex flex-col items-center justify-center h-full text-muted-foreground py-12'>
            <Icon name='magnifyingGlass' className='size-12 mb-4 opacity-20' />
            <p className='text-lg'>No results found for &quot;{search}&quot;</p>
            <p className='text-sm opacity-70'>
              Try searching for something else
            </p>
          </div>
        ) : (
          filteredSections.map((section) => {
            let itemOffset = 0;
            const sectionIndex = filteredSections.indexOf(section);
            for (let i = 0; i < sectionIndex; i++) {
              itemOffset += filteredSections[i].items.length;
            }

            return (
              <div key={section.label} className='mb-8'>
                <SectionTitle icon={section.icon} title={section.label} />
                <div
                  className={`grid gap-3 ${section.isDb ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}
                >
                  {section.items.map((item, index) => {
                    const isSelected = itemOffset + index === selectedIndex;
                    return (
                      <div
                        key={item.key}
                        data-selected={isSelected}
                        className='scroll-mt-4'
                        onClick={() => drawer.close()}
                      >
                        {'type' in item ? (
                          <>
                            {item.type === 'post' && (
                              <PostCard
                                post={item.data as Post}
                                isActive={isSelected}
                              />
                            )}
                            {item.type === 'project' && (
                              <ProjectCard
                                project={item.data as Project}
                                isActive={isSelected}
                              />
                            )}
                            {item.type === 'book' && (
                              <BookCard
                                book={item.data as Book}
                                isActive={isSelected}
                              />
                            )}
                            {item.type === 'publication' && (
                              <PublicationCard
                                publication={item.data as Publication}
                                isActive={isSelected}
                              />
                            )}
                          </>
                        ) : (
                          <NavigationCard
                            title={(item as StaticKbarItem).label}
                            desc={(item as StaticKbarItem).desc}
                            icon={(item as StaticKbarItem).icon}
                            href={(item as StaticKbarItem).href}
                            isActive={isSelected}
                            action={() => handleAction(item as StaticKbarItem)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
