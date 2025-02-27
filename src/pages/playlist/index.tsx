import { Icon } from '~/components/UI';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pageLayout } from '~/components/Page';
import type { NextPageWithLayout } from '~/pages/_app';
import PlaylistCard from '~/components/Card/Playlist';
import { Playlist } from '~/types/playlist';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import PlaylistForm from '~/components/Form/Playlist';
import { Button } from '~/components/UI';

const PlaylistPage: NextPageWithLayout = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/api/playlist');
        const data = await response.json();
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleAddPlaylistClick = () => {
    drawer.open(<PlaylistForm />);
  };

  return (
    <div>
      <Head>
        <title>Music Playlist - Zulfikar</title>
        <meta name='description' content="Zulfikar's music playlists" />
      </Head>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1 items-center'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3 inline-block'>🎵</span>
              Music Playlists
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end whitespace-nowrap'>
            <div className='flex-1 px-5'>
              <p className='text-xl text-gray-500 dark:text-gray-400'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 h-6 w-6'>
                    <Icon name='left' />
                  </span>
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <div className='mb-6 flex justify-end'>
          <Button type='primary' onClick={handleAddPlaylistClick}>
            Add Playlist
          </Button>
        </div>
      )}

      {loading ? (
        <div className='flex justify-center py-10'>
          <div className='animate-pulse text-gray-500 dark:text-gray-400'>
            Loading playlists...
          </div>
        </div>
      ) : playlists.length > 0 ? (
        <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2'>
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} {...playlist} />
          ))}
        </div>
      ) : (
        <div className='mt-8 rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <p className='text-gray-500 dark:text-gray-400'>
            No playlists found. Create your first playlist!
          </p>
        </div>
      )}
    </div>
  );
};

PlaylistPage.layout = pageLayout;

export default PlaylistPage;
