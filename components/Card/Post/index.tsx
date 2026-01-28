import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from 'components/Card';
import { Post } from 'types/post';
import { trimStr } from 'utilities/string';

import AudioPlayer from '@/components/AudioPlayer';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Icon, Label } from '@/components/UI';
import { TimeAgo } from '@/components/UI';
import { Hover } from '@/components/Visual';
import { renderMarkdown } from '@/utilities/renderMarkdown';

interface PostCardProps {
  post?: Post;
  openForm?: boolean;
  isInForm?: boolean;
  isActive?: boolean;
  isPreview?: boolean;
}

export default function PostCard({
  post,
  openForm,
  isInForm,
  isActive,
  isPreview,
}: PostCardProps) {
  const router = useRouter();

  if (!post) return null;

  const handleCardClick = () => {
    if (isInForm) return;

    const identifier = post.slug || post.id;
    if (openForm) {
      router.push(`/database/posts/${identifier}/edit`);
    } else {
      router.push(`/posts/${identifier}`);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    if (isInForm) return;
    e.stopPropagation();
    try {
      const identifier = post.slug || post.id;
      const shareUrl = `${window.location.origin}/posts/${identifier}`;
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
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border border-border shadow-sm transition-all hover:shadow-md dark:opacity-90'
        >
          <ImageWithFallback
            src={post.image || '/images/placeholder.png'}
            alt={`featured-image-${post.title}`}
            fill
            className='rounded-md object-cover'
            loading='lazy'
            type='portrait'
            sizes='(max-width: 640px) 120px, 150px'
          />
        </Hover>
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
    <Card
      onClick={handleCardClick}
      openForm={openForm}
      isInForm={isInForm}
      isActive={isActive}
      isPreview={isPreview}
    >
      <div className='flex p-6 gap-6 lg:p-8 lg:gap-8'>
        {renderMedia()}

        <div className='flex flex-col space-y-4 flex-1'>
          <div className='flex items-center'>
            {post.categories &&
              (isInForm ? (
                <Label type='secondary' icon='tag'>
                  {post.categories[0]}
                </Label>
              ) : (
                <div className='flex flex-wrap gap-3'>
                  {post.categories?.map((category) =>
                    isInForm ? (
                      <Label key={category} type='secondary' icon='tag'>
                        {category}
                      </Label>
                    ) : (
                      <Link key={category} href={`/posts/cate/${category}`}>
                        <Label type='secondary' icon='tag'>
                          {category}
                        </Label>
                      </Link>
                    ),
                  )}
                </div>
              ))}
          </div>

          <h1 className='text-xl lg:text-2xl font-medium tracking-wider text-foreground'>
            {post.title}
          </h1>

          <div
            className='overflow-hidden text-ellipsis text-sm lg:text-md tracking-wide text-muted-foreground line-clamp-3'
            dangerouslySetInnerHTML={{
              __html: trimStr(renderMarkdown(post.excerpt), 150),
            }}
          />
        </div>
      </div>
      {renderAudio()}

      <div className='h-auto w-full items-center rounded-bl-md rounded-br-md border-t border-border px-6 py-2 lg:px-8 lg:py-3 dark:border-border'>
        <div className='leading-2 flex items-center justify-between whitespace-nowrap text-xs tracking-wide text-muted-foreground lg:text-sm lg:leading-8'>
          <span className='flex items-center gap-x-2'>
            <TimeAgo date={post.dateString} prefix='Posted' />
          </span>
          <span className='flex items-center'>
            <button
              className='effect-pressing flex items-center gap-x-2 cursor-pointer transition-colors hover:text-primary'
              onClick={handleShare}
            >
              <Icon name='share' size={15} />
              Share
            </button>
          </span>
        </div>
      </div>
    </Card>
  );
}
