import { Card } from '@/components/Card';
import { Button, Icon, Tooltip } from '@/components/UI';
import Link from 'next/link';

const PagesAndLinks = () => {
  return (
    <Card isPreview>
      <div className='flex w-full items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
        <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
          <span className='size-5'>
            <Icon name='cube' />
          </span>
          <span>Pages & Links</span>
        </div>
        <div className='hidden md:block'>
          <Tooltip text='All Pages'>
            <Link href='/pages'>
              <Button className='h-7 p-1 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'>
                <span className='size-5'>
                  <Icon name='caretRight' />
                </span>
              </Button>
            </Link>
          </Tooltip>
        </div>
        <div className='block md:hidden'>
          <Link href='/pages'>
            <Button className='h-7 p-1 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'>
              <span className='size-5'>
                <Icon name='caretRight' />
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='mask-x mt-4 flex items-center justify-between gap-x-2.5 overflow-x-auto whitespace-nowrap px-4.5 pb-4'>
        <div className='flex items-center gap-x-2.5'>
          <Link href='/contacts'>
            <Button
              icon='addressBook'
              className='h-7 px-3 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'
            >
              Contacts
            </Button>
          </Link>

          <Link
            href='/documents/resume.pdf'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button
              icon='file'
              className='h-7 px-3 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'
            >
              Résumé
            </Button>
          </Link>

          <Link href='/projects'>
            <Button
              icon='package'
              className='h-7 px-3 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'
            >
              Projects
            </Button>
          </Link>

          <Link href='/publications'>
            <Button
              icon='newspaper'
              className='h-7 px-3 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'
            >
              Publications
            </Button>
          </Link>

          <Link href='/music'>
            <Button
              icon='musicNotes'
              className='h-7 px-3 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'
            >
              Music
            </Button>
          </Link>

          <Link href='/feedback'>
            <Button
              icon='chatCenteredText'
              className='h-7 px-3 hover:bg-neutral-50 dark:bg-neutral-700 dark:hover:bg-neutral-600 tracking-normal'
            >
              Feedback
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PagesAndLinks;
