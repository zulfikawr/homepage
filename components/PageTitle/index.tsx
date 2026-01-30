'use client';

import { useEffect } from 'react';

import { MarkdownRenderer, Separator, Skeleton } from '@/components/UI';
import { useTitle } from '@/contexts/titleContext';

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
    red: 'rounded-md border-2 border-gruv-red/40 bg-gruv-red/15 px-2.5 py-1 text-xs font-medium text-gruv-red dark:border-gruv-red/50 dark:bg-gruv-red/20 shadow-brutalist-sm brutalist-interactive',
    yellow:
      'rounded-md border-2 border-gruv-yellow/40 bg-gruv-yellow/15 px-2.5 py-1 text-xs font-medium text-gruv-yellow dark:border-gruv-yellow/50 dark:bg-gruv-yellow/20 shadow-brutalist-sm brutalist-interactive',
    green:
      'rounded-md border-2 border-gruv-green/40 bg-gruv-green/15 px-2.5 py-1 text-xs font-medium text-gruv-green dark:border-gruv-green/50 dark:bg-gruv-green/20 shadow-brutalist-sm brutalist-interactive',
    blue: 'rounded-md border-2 border-gruv-blue/40 bg-gruv-blue/15 px-2.5 py-1 text-xs font-medium text-gruv-blue dark:border-gruv-blue/50 dark:bg-gruv-blue/20 shadow-brutalist-sm brutalist-interactive',
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
