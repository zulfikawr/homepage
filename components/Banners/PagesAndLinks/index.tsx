'use client';

import { useMemo } from 'react';
import Link from 'next/link';

import { Card } from '@/components/Card';
import { Button, Icon, Tooltip } from '@/components/UI';
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

  return (
    <Card isPreview>
      <div className='flex w-full items-center justify-between px-4 py-2.5 border-b border-border'>
        <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-foreground'>
          <span className='size-5 text-gruv-aqua'>
            <Icon name='cube' />
          </span>
          <span>Pages & Links</span>
        </div>
        <div className='hidden md:block'>
          <Tooltip text='All Pages'>
            <Link href='/pages'>
              <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
                <span className='size-5'>
                  <Icon name='caretRight' />
                </span>
              </Button>
            </Link>
          </Tooltip>
        </div>
        <div className='block md:hidden'>
          <Link href='/pages'>
            <Button className='h-7 p-1 dark:bg-muted tracking-normal'>
              <span className='size-5'>
                <Icon name='caretRight' />
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex items-center justify-between p-4 gap-x-2 overflow-x-auto whitespace-nowrap'>
        <div className='flex items-center gap-x-2.5'>
          <Link href='/contacts'>
            <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
              <span className='size-5 flex-shrink-0 text-gruv-aqua group-hover/btn:text-accent-foreground'>
                <Icon name='addressBook' />
              </span>
              Contacts
            </Button>
          </Link>

          <Link
            href={resume?.fileUrl || '#'}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
              <span className='size-5 flex-shrink-0 text-gruv-red group-hover/btn:text-accent-foreground'>
                <Icon name='filePdf' />
              </span>
              Résumé
            </Button>
          </Link>

          <Link href='/projects'>
            <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
              <span className='size-5 flex-shrink-0 text-gruv-yellow group-hover/btn:text-accent-foreground'>
                <Icon name='package' />
              </span>
              Projects
            </Button>
          </Link>

          <Link href='/publications'>
            <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
              <span className='size-5 flex-shrink-0 text-gruv-green group-hover/btn:text-accent-foreground'>
                <Icon name='newspaper' />
              </span>
              Publications
            </Button>
          </Link>

          <Link href='/music'>
            <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
              <span className='size-5 flex-shrink-0 text-gruv-blue group-hover/btn:text-accent-foreground'>
                <Icon name='musicNotes' />
              </span>
              Music
            </Button>
          </Link>

          <Link href='/feedback'>
            <Button className='group/btn h-7 px-3 dark:bg-muted tracking-normal gap-2'>
              <span className='size-5 flex-shrink-0 text-primary group-hover/btn:text-accent-foreground'>
                <Icon name='chatCenteredText' />
              </span>
              Feedback
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PagesAndLinks;
