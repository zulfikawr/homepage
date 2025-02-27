import React, { useState } from 'react';
import { Playlist, Song } from '~/types/playlist';
import { useAuth } from '~/contexts/authContext';
import { drawer } from '~/components/Drawer';
import { modal } from '~/components/Modal';
import { Button } from '~/components/UI';
import PlaylistCard from '~/components/Card/Playlist';
import SongCard from '~/components/Card/Song';
import { toast } from '~/components/Toast';

interface PlaylistFormProps {
  playlistToEdit?: Playlist;
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({ playlistToEdit }) => {
  const { user } = useAuth();
  const [name, setName] = useState(playlistToEdit?.name || '');
  const [description, setDescription] = useState(
    playlistToEdit?.description || '',
  );
  const [imageUrl, setImageUrl] = useState(playlistToEdit?.imageUrl || '');
  const [songs, setSongs] = useState<Song[]>(playlistToEdit?.songs || []);

  const [newSong, setNewSong] = useState<Partial<Song>>({
    title: '',
    artist: '',
    imageUrl: '',
    audioUrl: '',
    duration: '',
  });

  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.show('Playlist name is required.');
      return false;
    }
    if (!description.trim()) {
      toast.show('Description is required.');
      return false;
    }
    if (!imageUrl.trim()) {
      toast.show('Image URL is required.');
      return false;
    }
    if (songs.length === 0) {
      toast.show('At least one song is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) return;

    const playlistData = {
      id: playlistToEdit?.id || generateId(name),
      name,
      description,
      imageUrl: imageUrl || '/images/playlists/default.jpg',
      dateCreated:
        playlistToEdit?.dateCreated || new Date().toISOString().split('T')[0],
      songs,
    };

    const method = playlistToEdit ? 'PUT' : 'POST';
    const url = '/api/playlist';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        throw new Error('Failed to save playlist');
      }

      drawer.close();
      toast.show(
        playlistToEdit
          ? 'Playlist updated successfully!'
          : 'Playlist added successfully!',
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error saving playlist: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while saving the playlist.');
      }
    }
  };

  const handleDelete = async () => {
    if (!playlistToEdit || !user) return;

    try {
      const response = await fetch(`/api/playlist?id=${playlistToEdit.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      drawer.close();
      toast.show('Playlist deleted successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error deleting playlist: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while deleting the playlist.');
      }
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6'>
          Are you sure you want to delete this playlist? This action cannot be
          undone.
        </p>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            type='destructive'
            onClick={() => {
              handleDelete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSong.title || !newSong.artist || !newSong.audioUrl) {
      toast.show('Title, artist, and audio URL are required for a song.');
      return;
    }

    const songToAdd: Song = {
      id: Date.now().toString(),
      title: newSong.title,
      artist: newSong.artist,
      imageUrl: newSong.imageUrl || '/images/songs/default.jpg',
      audioUrl: newSong.audioUrl,
      duration: newSong.duration || '0:00',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    if (playlistToEdit) {
      try {
        const response = await fetch(
          `/api/playlist/${playlistToEdit.id}/song`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(songToAdd),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to add song');
        }

        setSongs([...songs, songToAdd]);
        setNewSong({
          title: '',
          artist: '',
          imageUrl: '',
          audioUrl: '',
          duration: '',
        });
        toast.show('Song added successfully!');
      } catch (error) {
        if (error instanceof Error) {
          toast.show(`Error adding song: ${error.message}`);
        } else {
          toast.show('An unknown error occurred while adding the song.');
        }
      }
    } else {
      setSongs([...songs, songToAdd]);
      setNewSong({
        title: '',
        artist: '',
        imageUrl: '',
        audioUrl: '',
        duration: '',
      });
      toast.show('Song added successfully!');
    }
  };

  const handleEditSong = (song: Song) => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Edit Song</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateSong(song);
          }}
          className='space-y-4'
        >
          <div>
            <label className='block text-sm font-medium mb-2'>
              Title <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={song.title}
              onChange={(e) =>
                setSongs((prev) =>
                  prev.map((s) =>
                    s.id === song.id ? { ...s, title: e.target.value } : s,
                  ),
                )
              }
              className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Artist <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={song.artist}
              onChange={(e) =>
                setSongs((prev) =>
                  prev.map((s) =>
                    s.id === song.id ? { ...s, artist: e.target.value } : s,
                  ),
                )
              }
              className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Audio URL <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={song.audioUrl}
              onChange={(e) =>
                setSongs((prev) =>
                  prev.map((s) =>
                    s.id === song.id ? { ...s, audioUrl: e.target.value } : s,
                  ),
                )
              }
              className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Image URL</label>
            <input
              type='text'
              value={song.imageUrl}
              onChange={(e) =>
                setSongs((prev) =>
                  prev.map((s) =>
                    s.id === song.id ? { ...s, imageUrl: e.target.value } : s,
                  ),
                )
              }
              className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Duration</label>
            <input
              type='text'
              value={song.duration}
              onChange={(e) =>
                setSongs((prev) =>
                  prev.map((s) =>
                    s.id === song.id ? { ...s, duration: e.target.value } : s,
                  ),
                )
              }
              className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <Button type='default' onClick={() => modal.close()}>
              Cancel
            </Button>
            <Button type='primary' onClick={() => handleUpdateSong(song)}>
              Save
            </Button>
          </div>
        </form>
      </div>,
    );
  };

  const handleUpdateSong = async (updatedSong: Song) => {
    if (!playlistToEdit) return;

    try {
      const response = await fetch(`/api/playlist/${playlistToEdit.id}/song`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSong),
      });

      if (!response.ok) {
        throw new Error('Failed to update song');
      }

      const updatedSongs = songs.map((song) =>
        song.id === updatedSong.id ? updatedSong : song,
      );
      setSongs(updatedSongs);
      setEditingSong(null);
      toast.show('Song updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error updating song: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while updating the song.');
      }
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlistToEdit) return;

    try {
      const response = await fetch(`/api/playlist/${playlistToEdit.id}/song`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove song');
      }

      const updatedSongs = songs.filter((song) => song.id !== songId);
      setSongs(updatedSongs);
      toast.show('Song removed successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.show(`Error removing song: ${error.message}`);
      } else {
        toast.show('An unknown error occurred while removing the song.');
      }
    }
  };

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {playlistToEdit ? 'Edit Playlist' : 'Create New Playlist'}
          </h1>
          <Button type='default' onClick={() => drawer.close()}>
            Close
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          {/* Playlist Preview */}
          <div className='flex justify-center'>
            <PlaylistCard
              id='preview'
              name={name || 'Playlist Name'}
              description={description || 'Playlist Description'}
              imageUrl={imageUrl || '/images/playlists/default.jpg'}
              dateCreated={
                playlistToEdit?.dateCreated ||
                new Date().toISOString().split('T')[0]
              }
              songs={songs}
              isInDrawer
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Playlist name'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Description <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Playlist description'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Image URL <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder='https://playlist-image-url.com'
                className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>

            {/* Song Form */}
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold'>Songs</h2>
              <form onSubmit={handleAddSong} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Title <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={newSong.title}
                    onChange={(e) =>
                      setNewSong({ ...newSong, title: e.target.value })
                    }
                    placeholder='Song title'
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Artist <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={newSong.artist}
                    onChange={(e) =>
                      setNewSong({ ...newSong, artist: e.target.value })
                    }
                    placeholder='Song artist'
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Audio URL <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={newSong.audioUrl}
                    onChange={(e) =>
                      setNewSong({ ...newSong, audioUrl: e.target.value })
                    }
                    placeholder='https://song-audio-url.com'
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Image URL
                  </label>
                  <input
                    type='text'
                    value={newSong.imageUrl}
                    onChange={(e) =>
                      setNewSong({ ...newSong, imageUrl: e.target.value })
                    }
                    placeholder='https://song-image-url.com'
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    Duration
                  </label>
                  <input
                    type='text'
                    value={newSong.duration}
                    onChange={(e) =>
                      setNewSong({ ...newSong, duration: e.target.value })
                    }
                    placeholder='0:00'
                    className='w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  />
                </div>
                <Button type='primary' onClick={handleAddSong}>
                  Add Song
                </Button>
              </form>

              {/* List of Songs */}
              <div className='space-y-4'>
                {songs.map((song) => (
                  <div key={song.id} className='relative'>
                    <SongCard song={song} />
                    <div className='absolute top-2 right-2 flex space-x-2'>
                      <Button
                        type='primary'
                        onClick={() => handleEditSong(song)}
                      >
                        Edit
                      </Button>
                      <Button
                        type='destructive'
                        onClick={() => handleRemoveSong(song.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex justify-end space-x-4'>
              {playlistToEdit && (
                <Button type='destructive' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
              <Button type='primary' onClick={handleSubmit}>
                {playlistToEdit ? 'Save Changes' : 'Create Playlist'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PlaylistForm;
