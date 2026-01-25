'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Label, Button, Separator } from '@/components/UI';
import { useTitle } from '@/contexts/titleContext';
import Link from 'next/link';
import { renderMarkdown } from '@/utilities/renderMarkdown';
import { Hover } from '@/components/Visual';
import ImageWithFallback from '@/components/ImageWithFallback';

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
}

const PageTitle = ({
  emoji,
  title,
  subtitle,
  badge,
  isPostTitle,
  category,
  image,
}: PageTitleProps) => {
  const { setHeaderTitle } = useTitle();
  const router = useRouter();

  useEffect(() => {
    setHeaderTitle(`${emoji ?? ''} ${title}`);
  }, [emoji, title, setHeaderTitle]);

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
            className={`flex flex-1 items-start ${isPostTitle && image ? 'gap-6' : 'gap-3'}`}
          >
            {isPostTitle && image && (
              <Hover
                perspective={1000}
                max={25}
                scale={1.01}
                className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border border-border shadow-sm transition-all hover:shadow-md dark:opacity-90'
              >
                <ImageWithFallback
                  src={image || '/images/placeholder.png'}
                  alt={`featured-image-${title}`}
                  fill
                  className='rounded-md object-cover'
                  loading='lazy'
                  type='portrait'
                />
              </Hover>
            )}
            {!isPostTitle && emoji && (
              <div className='text-[35px] drop-shadow-lg -rotate-6'>
                {emoji}
              </div>
            )}
            <div className='flex flex-col'>
              {isPostTitle && category && (
                <div className='mb-3 w-fit'>
                  <Link href={`/post/cate/${category}`}>
                    <Label type='primary' icon='tag'>
                      {category}
                    </Label>
                  </Link>
                </div>
              )}
              <h2 className='flex items-center gap-x-2 text-[28px] font-medium tracking-wide text-foreground leading-tight'>
                {title}
                {badge && (
                  <span className={badgeStyles[badge.color]}>{badge.text}</span>
                )}
              </h2>
              {subtitle && (
                <div
                  className={`text-sm text-muted-foreground ${
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
                <Button type='ghost' onClick={() => router.back()}>
                  <span className='mr-2 h-5 w-5'>
                    <Icon name='arrowLeft' />
                  </span>
                  Back
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
