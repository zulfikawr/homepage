import Link from 'next/link';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Post } from '~/types/post';
import { trimStr } from '~/utilities/string';

interface Props {
  post: Post;
}

const CardWithAudio = ({ post }: Props) => {
  return (
    <div className='mb-6 w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='p-5 lg:p-10'>
        <Link href={`/post/${post.slug}`}>
          <h1 className='mb-4 text-xl lg:text-2xl font-medium tracking-wider text-gray-700 dark:text-white hover:underline'>
            {post.title}
          </h1>
        </Link>
        <p
          className='leading-2 overflow-hidden text-ellipsis text-md tracking-wide text-gray-500 dark:text-gray-400'
          dangerouslySetInnerHTML={{
            __html: trimStr(post.excerpt, 150),
          }}
        />
      </div>

      <div className='px-2 pb-4 pt-4 lg:px-5'>
        <AudioPlayer
          className='podcast-player focus:outline-none'
          autoPlayAfterSrcChange={false}
          src={post.audioUrl}
          preload='metadata'
        />
      </div>
    </div>
  );
};

export default CardWithAudio;
