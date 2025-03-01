import Image from 'next/image';
import Link from 'next/link';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Hover } from '~/components/Visual';
import { Post } from '~/types/post';
import { trimStr } from '~/utilities/string';

interface Props {
  item: Post;
}

const CardWithImageAudio = ({ item }: Props) => {
  return (
    <div className='mb-6 w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='p-5 grid grid-flow-col lg:grid-cols-3 lg:gap-9 lg:p-10'>
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='podcast-image-placeholder relative col-span-1 h-48 w-full rounded-md border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md dark:opacity-90 lg:h-auto lg:w-full'
        >
          <Image
            src={item.img}
            fill
            className='rounded-md object-cover'
            alt={`podcast-episode-cover-art-${item.title}`}
            loading='lazy'
          />
        </Hover>

        <div className='col-span-2 mt-6 lg:mt-0'>
          <Link href={`/post/${item.slug}`}>
            <h1 className='mb-5 text-2 font-medium tracking-wider text-gray-700 dark:text-white lg:text-listTitle hover:underline'>
              {item.title}
            </h1>
          </Link>
          <p
            className='leading-2 overflow-hidden text-ellipsis text-4 tracking-wide text-gray-500 dark:text-gray-400 lg:text-3'
            dangerouslySetInnerHTML={{
              __html: trimStr(item.excerpt, 150),
            }}
          />
        </div>
      </div>

      <div className='px-2 pb-4 pt-4 lg:px-5'>
        <AudioPlayer
          className='podcast-player focus:outline-none'
          autoPlayAfterSrcChange={false}
          src={item.audioUrl}
          preload='metadata'
        />
      </div>
    </div>
  );
};

export default CardWithImageAudio;
