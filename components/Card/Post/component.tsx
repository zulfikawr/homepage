import { Icon, Label } from '@/components/UI';
import Link from 'next/link';
import Image from 'next/image';
import { Hover } from '@/components/Visual';
import AudioPlayer from 'react-h5-audio-player';
import { openReader } from '@/components/Reader';
import { trimStr } from 'utilities/string';
import { Post } from 'types/post';
import { drawer } from '@/components/Drawer';
import PostForm from '@/components/Form/Post';
import { Card } from 'components/Card';

interface PostCardComponentProps {
  post: Post;
  isInDrawer?: boolean;
  isInForm?: boolean;
}

export default function PostCardComponent({
  post,
  isInDrawer,
  isInForm,
}: PostCardComponentProps) {
  const handleCardClick = () => {
    if (isInDrawer) {
      drawer.open(<PostForm postToEdit={post} isInDrawer />);
    } else if (isInForm) {
      return;
    } else {
      window.location.href = `/post/${post.id}`;
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openReader(post);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.share({
        title: post.title,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } catch (err) {
      console.error('Failed to share:', err.message);
    }
  };

  const renderMedia = () => {
    if (post.img) {
      return (
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='relative w-[120px] sm:w-[150px] h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200 shadow-sm transition-all hover:shadow-md dark:opacity-90'
        >
          <Image
            fill
            src={post.img || '/images/placeholder.png'}
            className='rounded-md object-cover'
            alt={`featured-image-${post.title}`}
            loading='lazy'
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
    <Card onClick={handleCardClick} isInDrawer={isInDrawer} isInForm={isInForm}>
      <div className='flex p-6 gap-6 lg:p-8 lg:gap-8'>
        {renderMedia()}

        <div className='flex flex-col space-y-4 flex-1'>
          <div className='flex flex-wrap items-center gap-2 lg:gap-4'>
            {post.categories && (
              <Link href={`/post/cate/${post.categories[0]}`}>
                <Label type='primary' icon='folder'>
                  {post.categories[0]}
                </Label>
              </Link>
            )}
            <div onClick={handlePreviewClick}>
              <Label type='secondary' icon='magifyingGlassPlus'>
                Preview
              </Label>
            </div>
          </div>

          <h1 className='text-xl lg:text-2xl font-bold tracking-wider text-gray-700 dark:text-white'>
            {post.title}
          </h1>

          <p
            className='leading-relaxed overflow-hidden text-ellipsis text-sm lg:text-md tracking-wide text-gray-500 dark:text-gray-400 line-clamp-2'
            dangerouslySetInnerHTML={{
              __html: trimStr(post.excerpt, 150),
            }}
          />
        </div>
      </div>
      {renderAudio()}

      <div className='h-auto w-full items-center rounded-bl-md rounded-br-md border-t border-gray-100 px-6 py-2 lg:px-8 lg:py-3 dark:border-gray-700'>
        <p className='leading-2 flex items-center justify-between whitespace-nowrap text-5 tracking-wide text-gray-500 dark:text-gray-400 lg:text-4 lg:leading-8'>
          <span className='flex items-center gap-x-2'>
            <span>Posted {post.dateString}</span>
          </span>
          <span className='flex items-center'>
            <button
              className='effect-pressing flex items-center gap-x-2 hover:text-gray-600 dark:hover:text-gray-300'
              onClick={handleShare}
            >
              <div className='size-[15px]'>
                <Icon name='share' />
              </div>
              Share
            </button>
          </span>
        </p>
      </div>
    </Card>
  );
}
