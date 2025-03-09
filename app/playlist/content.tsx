'use client';

import { Icon } from '@/components/UI';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PlaylistCard from '@/components/Card/Playlist';
import { Playlist } from '@/types/playlist';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import PlaylistForm from '@/components/Form/Playlist';
import { Button } from '@/components/UI';
import { getPlaylists } from '@/functions/playlists';

export default function PlaylistContent() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const playlistsData = await getPlaylists();
        setPlaylists(playlistsData);
      } catch (err) {
        setError('Failed to load playlists');
        console.error('Error fetching playlists:', err);
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
              <p className='text-sm lg:text-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'>
                <Link href='/' className='flex items-center'>
                  <span className='mr-2 size-[16px]'>
                    <Icon name='houseLine' />
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
            No playlists found.
          </p>
        </div>
      )}
    </div>
  );
}
