'use client';

import { useEffect } from 'react';

import { Separator, Skeleton } from '@/components/UI';
import { useTitle } from '@/contexts/titleContext';
import { renderMarkdown } from '@/utilities/renderMarkdown';

interface PageTitleProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  badge?: {
    color: 'red' | 'yellow' | 'green' | 'blue';
    text: string;
  };
  isLoading?: boolean;
}

const PageTitle = ({
  emoji,
  title,
  subtitle,
  badge,
  isLoading = false,
}: PageTitleProps) => {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    if (!isLoading) {
      setHeaderTitle(`${emoji ?? ''} ${title}`);
    }
  }, [emoji, title, setHeaderTitle, isLoading]);

  const badgeStyles = {
    red: 'rounded-md border border-gruv-red/40 bg-gruv-red/15 px-2.5 py-1 text-xs font-medium text-gruv-red dark:border-gruv-red/50 dark:bg-gruv-red/20',
    yellow:
      'rounded-md border border-gruv-yellow/40 bg-gruv-yellow/15 px-2.5 py-1 text-xs font-medium text-gruv-yellow dark:border-gruv-yellow/50 dark:bg-gruv-yellow/20',
    green:
      'rounded-md border border-gruv-green/40 bg-gruv-green/15 px-2.5 py-1 text-xs font-medium text-gruv-green dark:border-gruv-green/50 dark:bg-gruv-green/20',
    blue: 'rounded-md border border-gruv-blue/40 bg-gruv-blue/15 px-2.5 py-1 text-xs font-medium text-gruv-blue dark:border-gruv-blue/50 dark:bg-gruv-blue/20',
  };

  return (
    <>
      <section className='mt-18 lg:mt-20'>
        <div className='mb-6 flex flex-col gap-3'>
          <div className='flex items-center gap-2.5 flex-wrap'>
            {emoji && !isLoading && (
              <span className='text-2xl lg:text-3xl flex items-center justify-center'>
                {emoji}
              </span>
            )}
            {isLoading && <Skeleton width={32} height={32} as='span' />}

            <div className='relative inline-block'>
              <h1 className='relative text-2xl lg:text-3xl font-bold tracking-tight text-foreground leading-tight pb-2'>
                {isLoading ? (
                  <Skeleton width={200} height={32} as='span' />
                ) : (
                  title
                )}
              </h1>
              {!isLoading && (
                <svg
                  className='absolute bottom-0 left-0 w-full pointer-events-none'
                  height='8'
                  xmlns='http://www.w3.org/2000/svg'
                  preserveAspectRatio='none'
                  viewBox='0 0 100 8'
                >
                  <path
                    d='M 0,4 Q 2,2 4,4 T 8,4 T 12,4 T 16,4 T 20,4 T 24,4 T 28,4 T 32,4 T 36,4 T 40,4 T 44,4 T 48,4 T 52,4 T 56,4 T 60,4 T 64,4 T 68,4 T 72,4 T 76,4 T 80,4 T 84,4 T 88,4 T 92,4 T 96,4 Q 98,2 100,4'
                    fill='none'
                    stroke='var(--primary)'
                    strokeWidth='2.5'
                    strokeLinecap='round'
                    opacity='0.8'
                  />
                </svg>
              )}
            </div>

            {badge && !isLoading && (
              <span className={badgeStyles[badge.color]}>{badge.text}</span>
            )}
          </div>

          {(subtitle || isLoading) && (
            <div className='text-xs lg:text-sm text-muted-foreground/90 max-w-3xl leading-relaxed'>
              {isLoading ? (
                <div className='space-y-1.5'>
                  <Skeleton width='100%' height={10} as='span' />
                  <Skeleton width='65%' height={10} as='span' />
                </div>
              ) : (
                <div
                  className='prose-sm [&>p]:my-0 [&>p]:text-muted-foreground/90'
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(subtitle || ''),
                  }}
                />
              )}
            </div>
          )}
        </div>
      </section>
      <Separator margin='4' />
    </>
  );
};

export default PageTitle;
