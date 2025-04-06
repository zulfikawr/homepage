import { Icon } from '@/components/UI';
import Tooltip from '@/components/UI/Tooltip';
import Link from 'next/link';

const PagesAndLinks = () => {
  return (
    <div className='w-full rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
      <div className='flex w-full items-center justify-between border-b border-neutral-200 px-4.5 py-2.5 dark:border-neutral-700'>
        <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-neutral-700 dark:text-white'>
          <span className='size-5'>
            <Icon name='cube' />
          </span>
          <span>Pages & Links</span>
        </div>
        <div className='hidden md:block'>
          <Tooltip text='All Pages'>
            <Link
              href='/pages'
              className='h-[25px] w-[25px] effect-pressing flex items-center justify-center rounded-full border p-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
            >
              <Icon name='caretRight' />
            </Link>
          </Tooltip>
        </div>
        <div className='block md:hidden'>
          <Link
            href='/pages'
            className='h-[25px] w-[25px] effect-pressing flex items-center justify-center rounded-full border p-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
          >
            <Icon name='caretRight' />
          </Link>
        </div>
      </div>
      <div className='mask-x mt-4 flex items-center justify-between gap-x-2.5 overflow-x-auto whitespace-nowrap px-4.5 pb-4 text-sm text-neutral-600 dark:text-neutral-300'>
        <div className='flex items-center gap-x-2.5'>
          <Link
            href='/contacts'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
          >
            <span className='flex items-center gap-x-2'>
              <div className='size-[18px]'>
                <Icon name='addressBook' />
              </div>
              <span>Contacts</span>
            </span>
          </Link>
          <Link
            href='/documents/resume.pdf'
            target='_blank'
            rel='noopener noreferrer'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
          >
            <span className='flex items-center gap-x-2'>
              <div className='size-[18px]'>
                <Icon name='file' />
              </div>
              <span>Résumé</span>
            </span>
          </Link>
          <Link
            href='/projects'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
          >
            <span className='flex items-center gap-x-2'>
              <div className='size-[18px]'>
                <Icon name='package' />
              </div>
              <span>Projects</span>
            </span>
          </Link>
          <Link
            href='/music'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
          >
            <span className='flex items-center gap-x-2'>
              <div className='size-[18px]'>
                <Icon name='musicNotes' />
              </div>
              <span>Music</span>
            </span>
          </Link>
          <Link
            href='/feedback'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-600'
          >
            <span className='flex items-center gap-x-2'>
              <div className='size-[18px]'>
                <Icon name='chatCenteredText' />
              </div>
              <span>Feedback</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagesAndLinks;
