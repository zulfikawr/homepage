'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Label } from '@/components/UI';
import { useTitle } from '@/contexts/titleContext';
import { incrementPageViews } from '@/functions/analytics';
import Separator from '../UI/Separator';
import Link from 'next/link';
import { renderMarkdown } from '@/utilities/renderMarkdown';

interface PageTitleProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  badge?: {
    color: 'red' | 'yellow' | 'green' | 'blue';
    text: string;
  };
  route?: string;
  isPostTitle?: boolean;
  category?: string;
}

const PageTitle = ({
  emoji,
  title,
  subtitle,
  badge,
  route,
  isPostTitle,
  category,
}: PageTitleProps) => {
  const { setHeaderTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    setHeaderTitle(`${emoji ?? ''} ${title}`);
    if (route) incrementPageViews(route);
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
          <div className='flex flex-1 items-center gap-3'>
            {emoji && (
              <div className='text-[35px] drop-shadow-lg -rotate-6'>
                {emoji}
              </div>
            )}
            <div className='flex flex-col'>
              {isPostTitle && category && (
                <div className='mb-3 w-fit'>
                  <Link href={`/post/cate/${category}`}>
                    <Label type='primary' icon='folder'>
                      {category}
                    </Label>
                  </Link>
                </div>
              )}
              <h2 className='flex items-center gap-x-2 text-[28px] font-medium tracking-wide text-black dark:text-white leading-tight'>
                {title}
                {badge && (
                  <span className={badgeStyles[badge.color]}>{badge.text}</span>
                )}
              </h2>
              {subtitle && (
                <div
                  className={`text-sm text-neutral-500 dark:text-neutral-400 ${
                    isPostTitle ? 'mt-2' : ''
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(subtitle),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {!isPostTitle && (
            <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
              <div className='flex-1 pl-5 pr-3'>
                <button
                  onClick={() => router.back()}
                  className='flex items-center text-sm lg:text-md text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                >
                  <span className='mr-2 h-5 w-5'>
                    <Icon name='arrowLeft' />
                  </span>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Separator margin='5' />
    </>
  );
};

export default PageTitle;
