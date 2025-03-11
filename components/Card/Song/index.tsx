'use client';

import Image from 'next/image';
import { useState } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Hover } from '@/components/Visual';
import { Song } from '@/types/playlist';

interface Props {
  song: Song;
}

const SongCard = ({ song }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='mb-6 w-full rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div
        className='p-5 lg:grid lg:grid-flow-col lg:grid-cols-3 lg:gap-9 lg:p-6 cursor-pointer'
        onClick={() => setExpanded(!expanded)}
      >
        <Hover
          perspective={1000}
          max={25}
          scale={1.01}
          className='song-image-placeholder relative col-span-1 h-48 w-full rounded-md border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:opacity-90 lg:h-auto lg:w-full'
        >
          <Image
            src={song.imageUrl || '/images/placeholder.png'}
            fill
            className='rounded-md object-cover'
            alt={`song-cover-${song.title}`}
            loading='lazy'
          />
        </Hover>

        <div className='col-span-2 mt-6 lg:mt-0'>
          <h2 className='mb-2 text-2 font-medium tracking-wider text-gray-700 dark:text-white lg:text-listTitle'>
            {song.title}
          </h2>
          <p className='leading-2 text-4 tracking-wide text-gray-500 dark:text-gray-400 lg:text-3'>
            {song.artist}
          </p>
        </div>
      </div>

      {expanded && (
        <div className='px-2 pb-4 pt-0 lg:px-5'>
          <AudioPlayer
            className='song-player focus:outline-none'
            autoPlayAfterSrcChange={false}
            src={song.audioUrl}
            preload='metadata'
            showJumpControls={true}
            showSkipControls={false}
            customAdditionalControls={[]}
          />
        </div>
      )}
    </div>
  );
};

export default SongCard;
