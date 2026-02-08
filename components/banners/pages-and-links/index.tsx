'use client';

import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Card, Skeleton } from '@/components/ui';
import { Button, Icon, Separator, Tooltip } from '@/components/ui';
import { IconName } from '@/components/ui/icon';
import Mask from '@/components/visual/mask';
import { Resume } from '@/types/resume';

const PagesAndLinksBanner = ({
  resume,
  isLoading = false,
  showMoreButton = true,
}: {
  resume: Resume | null;
  isLoading?: boolean;
  showMoreButton?: boolean;
}) => {
  const viewAllButton = (
    <Link href='/pages' prefetch={true}>
      <Button className='h-7 !p-1 dark:bg-muted tracking-normal'>
        {isLoading ? (
          <Skeleton width={20} height={20} />
        ) : (
          <Icon name='caretRight' className='size-5' />
        )}
      </Button>
    </Link>
  );

  const navLinks = [
    {
      label: 'Contacts',
      href: '/contacts',
      icon: 'addressBook',
      color: 'text-theme-aqua',
    },
    {
      label: 'Résumé',
      href: resume?.file_url || '#',
      icon: 'filePdf',
      color: 'text-theme-red',
      target: '_blank',
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: 'package',
      color: 'text-theme-yellow',
    },
    {
      label: 'Publications',
      href: '/publications',
      icon: 'newspaper',
      color: 'text-theme-green',
    },
    {
      label: 'Music',
      href: '/music',
      icon: 'musicNotes',
      color: 'text-theme-blue',
    },
    {
      label: 'Feedback',
      href: '/feedback',
      icon: 'chatCenteredText',
      color: 'text-primary',
    },
  ];

  return (
    <Card isPreview>
      <div className='flex w-full items-center justify-between px-4 py-3 bg-card-header'>
        <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
          {isLoading ? (
            <>
              <Skeleton width={28} height={28} className='rounded-md' />
              <Skeleton width={120} height={20} />
            </>
          ) : (
            <>
              <Icon name='cube' className='size-7 text-theme-red' />
              <span>Pages & Links</span>
            </>
          )}
        </div>

        {showMoreButton && (
          <>
            <div className='hidden md:block'>
              <Tooltip text='All Pages'>{viewAllButton}</Tooltip>
            </div>

            <div className='block md:hidden'>{viewAllButton}</div>
          </>
        )}
      </div>

      <Separator margin='0' />

      <Mask className='scrollbar-hide'>
        <div className='inline-flex min-w-full items-center p-4 gap-x-2.5 whitespace-nowrap'>
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    width={100}
                    height={32}
                    className='rounded-md shadow-brutalist border-2'
                  />
                ))
            : navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={!link.target}
                  target={link.target}
                  rel={
                    link.target === '_blank' ? 'noopener noreferrer' : undefined
                  }
                >
                  <Button className='group/btn !px-4 dark:bg-muted tracking-normal gap-2'>
                    <span
                      className={twMerge(
                        link.color,
                        'group-hover/btn:text-accent-foreground',
                      )}
                    >
                      <Icon name={link.icon as IconName} />
                    </span>
                    {link.label}
                  </Button>
                </Link>
              ))}
        </div>
      </Mask>
    </Card>
  );
};

export default PagesAndLinksBanner;
