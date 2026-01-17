import { Icon, Label } from '@/components/UI';
import Link from 'next/link';
import { Hover } from '@/components/Visual';
import AudioPlayer from 'react-h5-audio-player';
import { trimStr } from 'utilities/string';
import { Post } from 'types/post';
import { Card } from 'components/Card';
import { getTimeAgo } from '@/utilities/timeAgo';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useRouter } from 'next/navigation';
import { renderMarkdown } from '@/utilities/renderMarkdown';

interface PostCardProps {
  post: Post;
  openForm?: boolean;
  isInForm?: boolean;
}

export default function PostCard({ post, openForm, isInForm }: PostCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (isInForm) return;

    if (openForm) {
      router.push(`/database/posts/${post.id}/edit`);
    } else {
      router.push(`/post/${post.id}`);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    if (isInForm) return;
    e.stopPropagation();
    try {
      const shareUrl = `${window.location.origin}/post/${post.id}`;
      await navigator.share({
        title: post.title,
        url: shareUrl,
      });
    } catch (err: any) {
      // Ignored
    }
  };

  const renderMedia = () => {
    if (post.img) {
      return (
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 shadow-sm transition-all hover:shadow-md dark:opacity-90'
        >
          <ImageWithFallback
            src={post.img || '/images/placeholder.png'}
            alt={`featured-image-${post.title}`}
            fill
            className='rounded-md object-cover'
            loading='lazy'
            type='portrait'
          />
        </Hover>
      );
    }
    return null;
  };

  const renderAudio = () => {
    if (post.audioUrl) {
      return (
        <div className='px-2 py-4 lg:px-5'>
          <AudioPlayer
            className='podcast-player focus:outline-none'
            autoPlayAfterSrcChange={false}
            src={post.audioUrl}
            preload='metadata'
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Card onClick={handleCardClick} openForm={openForm} isInForm={isInForm}>
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
                      <Link key={category} href={`/post/cate/${category}`}>
                        <Label type='secondary' icon='tag'>
                          {category}
                        </Label>
                      </Link>
                    ),
                  )}
                </div>
              ))}
          </div>

          <h1 className='text-xl lg:text-2xl font-medium tracking-wider text-black dark:text-white'>
            {post.title}
          </h1>

          <div
            className='overflow-hidden text-ellipsis text-sm lg:text-md tracking-wide text-neutral-500 dark:text-neutral-400 line-clamp-3'
            dangerouslySetInnerHTML={{
              __html: trimStr(renderMarkdown(post.excerpt), 150),
            }}
          />
        </div>
      </div>
      {renderAudio()}

      <div className='h-auto w-full items-center rounded-bl-md rounded-br-md border-t border-neutral-100 px-6 py-2 lg:px-8 lg:py-3 dark:border-neutral-700'>
        <div className='leading-2 flex items-center justify-between whitespace-nowrap text-5 tracking-wide text-neutral-500 dark:text-neutral-400 lg:text-4 lg:leading-8'>
          <span className='flex items-center gap-x-2'>
            <span>Posted {getTimeAgo(post.dateString)}</span>
          </span>
          <span className='flex items-center'>
            <button
              className='effect-pressing flex items-center gap-x-2 hover:text-neutral-600 dark:hover:text-neutral-300'
              onClick={handleShare}
            >
              <div className='size-[15px]'>
                <Icon name='share' />
              </div>
              Share
            </button>
          </span>
        </div>
      </div>
    </Card>
  );
}
