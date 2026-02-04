'use client';

import { useEffect } from 'react';

import { MarkdownRenderer, Separator, Skeleton } from '@/components/ui';
import { useTitle } from '@/contexts/title-context';

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
    red: 'rounded-md border-2 border-theme-red/40 bg-theme-red/15 px-2.5 py-1 text-xs font-medium text-theme-red dark:border-theme-red/50 dark:bg-theme-red/20 shadow-brutalist-sm brutalist-interactive',
    yellow:
      'rounded-md border-2 border-theme-yellow/40 bg-theme-yellow/15 px-2.5 py-1 text-xs font-medium text-theme-yellow dark:border-theme-yellow/50 dark:bg-theme-yellow/20 shadow-brutalist-sm brutalist-interactive',
    green:
      'rounded-md border-2 border-theme-green/40 bg-theme-green/15 px-2.5 py-1 text-xs font-medium text-theme-green dark:border-theme-green/50 dark:bg-theme-green/20 shadow-brutalist-sm brutalist-interactive',
    blue: 'rounded-md border-2 border-theme-blue/40 bg-theme-blue/15 px-2.5 py-1 text-xs font-medium text-theme-blue dark:border-theme-blue/50 dark:bg-theme-blue/20 shadow-brutalist-sm brutalist-interactive',
  };

  return (
    <>
      <section className='mt-18 lg:mt-20'>
        <div className='mb-6 flex flex-col gap-3 select-none'>
          <div className='flex items-center gap-2.5 flex-wrap'>
            {emoji && !isLoading && (
              <span className='text-2xl lg:text-3xl flex items-center justify-center'>
                {emoji}
              </span>
            )}
            {isLoading && <Skeleton width={32} height={32} as='span' />}

            <div className='relative inline-block'>
              <h1 className='relative text-2xl lg:text-3xl font-bold tracking-tight text-foreground squiggly-underline leading-tight pb-2'>
                {isLoading ? (
                  <Skeleton width={200} height={32} as='span' />
                ) : (
                  title
                )}
              </h1>
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
                <MarkdownRenderer
                  content={subtitle || ''}
                  className='prose-sm [&>p]:my-0 [&>p]:text-muted-foreground/90'
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
