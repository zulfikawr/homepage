'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { Card } from '@/components/Card';
import { Button, Icon, Separator, Tooltip } from '@/components/UI';
import { useCollection } from '@/hooks';
import { mapRecordToResume } from '@/lib/mappers';
import { Resume } from '@/types/resume';

const PagesAndLinks = () => {
  const { data: resumeList } = useCollection<Resume>(
    'resume',
    mapRecordToResume,
  );

  const resume = useMemo(() => {
    return resumeList && resumeList.length > 0 ? resumeList[0] : null;
  }, [resumeList]);

  const ViewAllButton = (
    <Link href='/pages'>
      <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
        <Icon name='caretRight' className='size-5' />
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
      <div className='flex w-full items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-x-3 text-md font-medium tracking-wide text-foreground'>
          <Icon name='cube' className='size-7 text-gruv-aqua' />
          <span>Pages & Links</span>
        </div>

        <div className='hidden md:block'>
          <Tooltip text='All Pages'>{ViewAllButton}</Tooltip>
        </div>

        <div className='block md:hidden'>{ViewAllButton}</div>
      </div>

      <Separator margin='0' />

      <div className='flex items-center justify-between p-4 gap-x-2 overflow-x-auto whitespace-nowrap'>
        <div className='flex items-center gap-x-2.5'>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
                <span
                  className={`size-5 flex-shrink-0 ${link.color} group-hover/btn:text-accent-foreground`}
                >
                  <Icon name={link.icon} />
                </span>
                {link.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PagesAndLinks;
