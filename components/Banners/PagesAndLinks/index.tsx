'use client';

import Link from 'next/link';

import { Card, Skeleton } from '@/components/UI';
import { Button, Icon, Separator, Tooltip } from '@/components/UI';
import Mask from '@/components/Visual/Mask';
import { Resume } from '@/types/resume';

const PagesAndLinksBanner = ({
  resume,
  isLoading = false,
}: {
  resume: Resume | null;
  isLoading?: boolean;
}) => {
  const ViewAllButton = (
    <Link href='/pages' prefetch={true}>
      <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
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
      color: 'text-gruv-aqua',
    },
    {
      label: 'Résumé',
      href: resume?.fileUrl || '#',
      icon: 'filePdf',
      color: 'text-gruv-red',
      target: '_blank',
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: 'package',
      color: 'text-gruv-yellow',
    },
    {
      label: 'Publications',
      href: '/publications',
      icon: 'newspaper',
      color: 'text-gruv-green',
    },
    {
      label: 'Music',
      href: '/music',
      icon: 'musicNotes',
      color: 'text-gruv-blue',
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
              <Icon name='cube' className='size-7 text-gruv-red' />
              <span>Pages & Links</span>
            </>
          )}
        </div>

        <div className='hidden md:block'>
          <Tooltip text='All Pages'>{ViewAllButton}</Tooltip>
        </div>

        <div className='block md:hidden'>{ViewAllButton}</div>
      </div>

      <Separator margin='0' />

      <Mask className='scrollbar-hide'>
        <div className='inline-flex min-w-full items-center px-4 py-4 gap-x-2.5 whitespace-nowrap'>
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
                  <Button className='group/btn px-3 dark:bg-muted tracking-normal gap-2'>
                    <span
                      className={`${link.color} group-hover/btn:text-accent-foreground`}
                    >
                      <Icon name={link.icon} />
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
