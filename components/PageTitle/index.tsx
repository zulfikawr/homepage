'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/UI';
import { useTitle } from '@/contexts/titleContext';
import { incrementPageViews } from '@/functions/analytics';

interface PageTitleProps {
  emoji: string;
  title: string;
  subtitle?: string;
  badge?: {
    color: 'red' | 'yellow' | 'green' | 'blue';
    text: string;
  };
  route: string;
}

const PageTitle = ({
  emoji,
  title,
  subtitle,
  badge,
  route,
}: PageTitleProps) => {
  const { setHeaderTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    setHeaderTitle(`${emoji} ${title}`);
    incrementPageViews(route);
  }, [emoji, title, setHeaderTitle, route]);

  const badgeStyles = {
    red: 'rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-xs text-red-500 dark:border-red-700 dark:bg-red-800 dark:text-red-400',
    yellow:
      'rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-500 dark:border-yellow-700 dark:bg-yellow-800 dark:text-yellow-400',
    green:
      'rounded-full border border-green-300 bg-green-50 px-2 py-0.5 text-xs text-green-500 dark:border-green-700 dark:bg-green-800 dark:text-green-400',
    blue: 'rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs text-blue-500 dark:border-blue-700 dark:bg-blue-800 dark:text-blue-400',
  };

  return (
    <>
      <section className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex flex-1 items-center'>
            <div className='mr-4.5 mt-1 flex -rotate-6 items-center'>
              <span className='text-[35px] drop-shadow-lg'>{emoji}</span>
            </div>
            <div>
              <h2 className='flex items-center gap-x-1.5 text-[28px] font-medium tracking-wide text-black dark:text-white'>
                {title}
                {badge && (
                  <span className={badgeStyles[badge.color]}>{badge.text}</span>
                )}
              </h2>
              {subtitle && (
                <p className='-mt-1 text-sm text-neutral-500 dark:text-gray-400'>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 pl-5 pr-3'>
              <button
                onClick={() => router.back()}
                className='flex items-center text-sm lg:text-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <span className='mr-2 h-5 w-5'>
                  <Icon name='arrowLeft' />
                </span>
                Back
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className='my-5'>
        <hr className='dark:border-gray-600' />
      </div>
    </>
  );
};

export default PageTitle;
