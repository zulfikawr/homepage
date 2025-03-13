'use client';

import PlaylistCard from '@/components/Card/Playlist';
import { useAuth } from '@/contexts/authContext';
import { drawer } from '@/components/Drawer';
import { Button } from '@/components/UI';
import { getPlaylists } from '@/functions/playlists';
import PageTitle from '@/components/PageTitle';
import { useFetchData } from '@/lib/fetchData';
import PlaylistDrawer from '@/components/Drawer/Playlist';

export default function PlaylistContent() {
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
        route='/playlist'
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
          <div className='animate-pulse text-neutral-500 dark:text-neutral-400'>
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
        <div className='mt-8 rounded-md border border-neutral-200 bg-white p-6 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='text-neutral-500 dark:text-neutral-400'>
            No playlists found.
          </p>
        </div>
      )}
    </div>
  );
}
