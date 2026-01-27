'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Icon, Label, Separator, Skeleton } from '@/components/UI';
import { Hover } from '@/components/Visual';
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
  isPostTitle?: boolean;
  category?: string;
  image?: string;
  isLoading?: boolean;
}

const PageTitle = ({
  emoji,
  title,
  subtitle,
  badge,
  isPostTitle,
  category,
  image,
  isLoading = false,
}: PageTitleProps) => {
  const { setHeaderTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      setHeaderTitle(`${emoji ?? ''} ${title}`);
    }
  }, [emoji, title, setHeaderTitle, isLoading]);

  const badgeStyles = {
    red: 'rounded-full border border-gruv-red/30 bg-gruv-red/10 px-2 py-0.5 text-xs text-destructive dark:border-gruv-red/30 dark:bg-gruv-red/20 dark:text-gruv-red',
    yellow:
      'rounded-full border border-gruv-yellow/30 bg-gruv-yellow/10 px-2 py-0.5 text-xs text-gruv-yellow dark:border-gruv-yellow/30 dark:bg-gruv-yellow/20 dark:text-gruv-yellow',
    green:
      'rounded-full border border-gruv-green/30 bg-gruv-green/10 px-2 py-0.5 text-xs text-gruv-green dark:border-gruv-green/30 dark:bg-gruv-green/20 dark:text-gruv-green',
    blue: 'rounded-full border border-gruv-blue/30 bg-gruv-blue/10 px-2 py-0.5 text-xs text-gruv-blue dark:border-gruv-blue/30 dark:bg-gruv-blue/20 dark:text-gruv-blue',
  };

  return (
    <>
      <section className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-start'>
          <div
            className={`flex flex-1 items-start ${isPostTitle && (image || isLoading) ? 'gap-6' : 'gap-3'}`}
          >
            {isPostTitle && (image || isLoading) && (
              <Hover
                perspective={1000}
                max={25}
                scale={1.01}
                className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border border-border shadow-sm transition-all hover:shadow-md dark:opacity-90'
              >
                {isLoading ? (
                  <Skeleton width='100%' height='100%' />
                ) : (
                  <ImageWithFallback
                    src={image || '/images/placeholder.png'}
                    alt={`featured-image-${title}`}
                    fill
                    className='rounded-md object-cover'
                    loading='lazy'
                    type='portrait'
                  />
                )}
              </Hover>
            )}
            {!isPostTitle && (emoji || isLoading) && (
              <div className='text-[35px] drop-shadow-lg -rotate-6 h-[52px] flex items-center'>
                {isLoading ? (
                  <Skeleton width={40} height={40} as='span' />
                ) : (
                  emoji
                )}
              </div>
            )}
            <div className='flex flex-col flex-1'>
              {isPostTitle && (category || isLoading) && (
                <div className='mb-3 w-fit'>
                  {isLoading ? (
                    <Skeleton
                      width={80}
                      height={24}
                      className='rounded-md'
                      as='span'
                    />
                  ) : (
                    <Link href={`/post/cate/${category}`}>
                      <Label type='primary' icon='tag'>
                        {category}
                      </Label>
                    </Link>
                  )}
                </div>
              )}
              <h2 className='flex items-center gap-x-2 text-[28px] font-medium tracking-wide text-foreground leading-tight min-h-[35px]'>
                {isLoading ? (
                  <Skeleton width='80%' height={28} as='span' />
                ) : (
                  <>
                    {title}
                    {badge && (
                      <span className={badgeStyles[badge.color]}>
                        {badge.text}
                      </span>
                    )}
                  </>
                )}
              </h2>
              {(subtitle || isLoading) && (
                <div
                  className={`text-sm text-muted-foreground ${
                    isPostTitle ? 'mt-2' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className='space-y-2 mt-2'>
                      <Skeleton width='100%' height={14} as='span' />
                      <Skeleton width='60%' height={14} as='span' />
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(subtitle || ''),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          {!isPostTitle && !isLoading && (
            <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
              <div className='flex-1 pl-5 pr-3'>
                <Button
                  type='ghost'
                  onClick={() => router.back()}
                  className='hover:bg-transparent group/back'
                >
                  <span className='mr-2 h-5 w-5 group-hover/back:text-primary transition-colors'>
                    <Icon name='arrowLeft' />
                  </span>
                  <span className='group-hover/back:text-primary transition-colors'>
                    Back
                  </span>
                </Button>
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
