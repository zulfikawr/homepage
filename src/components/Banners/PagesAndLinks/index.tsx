import { Icon } from '~/components/UI';
import Link from 'next/link';

const PagesAndLinks = () => {
  return (
    <div className='w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex w-full items-center border-b border-gray-200 px-4.5 py-2.5 dark:border-gray-700'>
        <div className='flex items-center gap-x-[7px] text-[15px] font-medium tracking-wide text-gray-700 dark:text-white'>
          <span className='h-4.5 w-4.5 lg:h-7 lg:w-7'>
            <Icon name='cube' />
          </span>
          <span>Pages & Links</span>
        </div>
      </div>
      <div className='mask-x mt-4 flex items-center justify-between gap-x-2.5 overflow-x-auto whitespace-nowrap px-4.5 pb-4 text-sm text-gray-600 dark:text-gray-300'>
        <div className='flex items-center gap-x-2.5'>
          <Link
            href='/contacts'
            target='_blank'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600'
          >
            <span className='h-4.5 w-4.5 lg:h-[16px] lg:w-[16px]'>
              <Icon name='me' />
            </span>
            <span className='flex items-center gap-x-2'>
              <span>Contacts</span>
            </span>
          </Link>
          <Link
            href='/schedule'
            target='_blank'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600'
          >
            <span className='h-4.5 w-4.5 lg:h-[16px] lg:w-[16px]'>
              <Icon name='calendarSchedule' />
            </span>
            <span>Schedule a Meeting</span>
          </Link>
          <Link
            href='/documents/resume.pdf'
            target='_blank'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600'
          >
            <span className='h-4.5 w-4.5 lg:h-[16px] lg:w-[16px]'>
              <Icon name='profile' />
            </span>
            <span className='flex items-center gap-x-2'>
              <span>Curriculum Vitae</span>
            </span>
          </Link>
          <Link
            href='/feedback'
            target='_blank'
            className='effect-pressing flex items-center gap-x-[4px] rounded-md border px-3 py-1 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600'
          >
            <span className='h-4.5 w-4.5 lg:h-[16px] lg:w-[16px]'>
              <Icon name='comments' />
            </span>
            <span className='flex items-center gap-x-2'>
              <span>Feedback</span>
            </span>
          </Link>
        </div>
        <div>
          <Link
            href='/pages'
            aria-label='See all pages'
            className='flex h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:border dark:border-gray-600 dark:bg-transparent dark:text-gray-500'
          >
            <span className='h-[16px] w-[16px]'>
              <Icon name='chevronRight' />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagesAndLinks;
