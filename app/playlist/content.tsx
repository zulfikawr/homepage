'use client';

import { useEffect } from 'react';
import PlaylistCard from '@/components/Card/Playlist';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import { Button } from '@/components/UI';
import { getPlaylists } from '@/functions/playlists';
import PageTitle from '@/components/PageTitle';
import { useTitle } from '@/contexts/titleContext';
import { useFetchData } from '@/lib/fetchData';
import PlaylistDrawer from '@/components/Drawer/Playlist';

export default function PlaylistContent() {
  const { setHeaderTitle } = useTitle();

  useEffect(() => {
    setHeaderTitle('🎵 Playlists');
  });

  const { user } = useAuth();

  const {
    data: playlists,
    loading,
    error,
    refetch,
  } = useFetchData(getPlaylists);

  if (error) return <div>Failed to load podcast</div>;

  const handleOpenPlaylistDrawer = () => {
    drawer.open(<PlaylistDrawer playlists={playlists} onUpdate={refetch} />);
  };

  return (
    <div>
      <PageTitle
        emoji='🎵'
        title='Playlists'
        subtitle='I made a playlist once in a while, so here you go.'
      />

      {user && (
        <div className='mb-6 flex justify-end'>
          <Button type='primary' onClick={handleOpenPlaylistDrawer}>
            Manage
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
