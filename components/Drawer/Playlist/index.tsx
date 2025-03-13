import PlaylistCard from '@/components/Card/Playlist';
import { Playlist } from '@/types/playlist';
import { drawer } from '@/components/Drawer';
import PlaylistForm from '@/components/Form/Playlist';
import { Button } from '@/components/UI';

const PlaylistDrawer = ({
  playlists,
  onUpdate,
}: {
  playlists: Playlist[];
  onUpdate: () => Promise<void>;
}) => {
  const handleEditPodcast = (playlist: Playlist) => {
    drawer.open(<PlaylistForm playlistToEdit={playlist} onUpdate={onUpdate} />);
  };

  const handleAddPodcast = () => {
    drawer.open(<PlaylistForm onUpdate={onUpdate} />);
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-neutral-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Playlist</h1>
          <div className='flex items-center space-x-2'>
            <Button type='primary' icon='plus' onClick={handleAddPodcast}>
              <span className='hidden lg:block'>Add Playlist</span>
            </Button>
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 overflow-y-auto w-full p-4'>
        {playlists.map((playlist, index) => (
          <div
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditPodcast(playlist);
            }}
            className='cursor-pointer'
          >
            <PlaylistCard {...playlist} isInDrawer />
          </div>
        ))}
      </div>
    </>
  );
};

export default PlaylistDrawer;
