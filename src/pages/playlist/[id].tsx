import { Icon } from '~/components/UI';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pageLayout } from '~/components/Page';
import type { NextPageWithLayout } from '~/pages/_app';
import { useRouter } from 'next/router';
import SongCard from '~/components/Card/Song';
import Image from 'next/image';
import { Playlist } from '~/types/playlist';

const PlaylistDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`/api/playlist/${id}`);
        const data = await response.json();
        setPlaylist(data.playlist);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <div className='flex justify-center py-10'>
        <div className='animate-pulse text-gray-500 dark:text-gray-400'>
          Loading playlist...
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className='mt-8 rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-gray-500 dark:text-gray-400'>Playlist not found</p>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{playlist.name} - Zulfikar</title>
        <meta
          name='description'
          content={`${playlist.name} - ${playlist.description}`}
        />
      </Head>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <Link
              href='/playlist'
              className='flex items-center text-sm lg:text-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4'
            >
              <span className='mr-2 h-6 w-6'>
                <Icon name='left' />
              </span>
              Back to Playlists
            </Link>
          </div>
        </div>
      </div>

      <div className='mb-8 flex flex-col lg:flex-row gap-6 items-start'>
        <div className='relative h-48 w-48 flex-shrink-0 rounded-md border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <Image
            src={playlist.imageUrl || '/placeholder.svg'}
            fill
            className='rounded-md object-cover'
            alt={`playlist-cover-${playlist.name}`}
            loading='lazy'
          />
        </div>
        <div>
          <h1 className='text-1 font-medium tracking-wide text-black dark:text-white mb-2'>
            {playlist.name}
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>
            {playlist.description}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {playlist.songs.length} songs
          </p>
        </div>
      </div>

      <div className='mt-8 space-y-6'>
        {playlist.songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

PlaylistDetailPage.layout = pageLayout;

export default PlaylistDetailPage;
