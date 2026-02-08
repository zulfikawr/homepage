'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Post } from 'types/post';
import { trimStr } from 'utilities/string';

import AudioPlayer from '@/components/audio-player';
import ImageWithFallback from '@/components/image-with-fallback';
import { renderMarkdown } from '@/utilities/render-markdown';

import { Button, Icon, Label } from '../../..';
import { TimeAgo } from '../../..';
import { Card } from '../..';

interface PostCardProps {
  post?: Post;
  openForm?: boolean;
  isActive?: boolean;
  isPreview?: boolean;
}

export default function PostCard({
  post,
  openForm,
  isActive,
  isPreview,
}: PostCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const identifier = post?.slug;
  const href = openForm
    ? `/database/posts/${identifier}/edit`
    : `/posts/${identifier}`;

  const handleCardClick = () => {
    if (isPreview) return;
    router.push(href);
  };

  // Prefetch the post page when card is in viewport
  useEffect(() => {
    if (isPreview || !post) return;

    const currentRef = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            router.prefetch(href);
          }
        });
      },
      { rootMargin: '50px' },
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [router, href, isPreview, post]);

  if (!post) return null;

  const handleShare = async (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.origin}/posts/${post.slug}`;
      await navigator.share({
        title: post.title,
        url: shareUrl,
      });
    } catch {
      // Ignored
    }
  };

  const renderMedia = () => {
    if (post.image) {
      return (
        <div className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border-2 border-border shadow-brutalist transition-all hover:shadow-brutalist-xl dark:opacity-90'>
          <ImageWithFallback
            src={post.image || '/images/placeholder.png'}
            alt={`featured-image-${post.title}`}
            fill
            className='rounded-md object-cover'
            loading='lazy'
            type='portrait'
            sizes='(max-width: 640px) 120px, 150px'
          />
        </div>
      );
    }
    return null;
  };

  const renderAudio = () => {
    if (post.audio) {
      return (
        <div className='px-4 pb-4 lg:px-6 lg:pb-6'>
          <AudioPlayer src={post.audio} />
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={cardRef} className={isPreview ? 'w-full' : ''}>
      <Card
        onClick={isPreview ? undefined : handleCardClick}
        openForm={openForm}
        isPreview={isPreview}
        isActive={isActive}
      >
        <div
          className={twMerge(
            'flex p-6 gap-6 lg:p-8 lg:gap-8',
            !post.image ? 'flex-col' : '',
          )}
        >
          {renderMedia()}

          <div className='flex flex-col space-y-4 flex-1'>
            <div className='flex items-center'>
              {post.categories &&
                (isPreview ? (
                  <Label variant='secondary' icon='tag'>
                    {post.categories[0]}
                  </Label>
                ) : (
                  <div className='flex flex-wrap gap-3'>
                    {post.categories?.map((category) =>
                      isPreview ? (
                        <Label key={category} variant='aqua' icon='tag'>
                          {category}
                        </Label>
                      ) : (
                        <Link
                          key={category}
                          href={`/posts/cate/${category}`}
                          prefetch={true}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Label variant='aqua' icon='tag'>
                            {category}
                          </Label>
                        </Link>
                      ),
                    )}
                  </div>
                ))}
            </div>

            <h1 className='text-xl lg:text-2xl font-medium tracking-wider text-foreground group-hover:text-primary transition-color duration-200'>
              {post.title}
            </h1>

            <div
              className='overflow-hidden text-ellipsis text-sm lg:text-md tracking-wide text-muted-foreground line-clamp-3'
              dangerouslySetInnerHTML={{
                __html: trimStr(renderMarkdown(post.excerpt || ''), 150),
              }}
            />
          </div>
        </div>
        {renderAudio()}

        <div className='h-auto w-full items-center rounded-bl-md rounded-br-md border-t-2 border-border px-6 py-2 lg:px-8 lg:py-3 '>
          <div className='leading-2 flex items-center justify-between whitespace-nowrap text-xs tracking-wide text-muted-foreground lg:text-sm lg:leading-8'>
            <span className='flex items-center gap-x-2'>
              <TimeAgo date={post.date_string || ''} prefix='Posted' />
            </span>
            <span className='flex items-center'>
              <Button
                variant='ghostLink'
                className='h-auto py-0 px-0 gap-1.5 text-xs lg:text-sm'
                onClick={handleShare}
              >
                <Icon name='share' size={14} />
                Share
              </Button>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
