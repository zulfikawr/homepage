'use client';

import React, { useState } from 'react';
import { Playlist, Song } from 'types/playlist';
import { useAuth } from 'contexts/authContext';
import { drawer } from 'components/Drawer';
import { modal } from 'components/Modal';
import { Button } from 'components/UI';
import PlaylistCard from 'components/Card/Playlist';
import SongCard from 'components/Card/Song';
import { toast } from 'components/Toast';
import { generateId } from 'utilities/generateId';
import {
  addPlaylist,
  deletePlaylist,
  updatePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from '@/functions/playlists';

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
  });

  const [, setEditingSong] = useState<Song | null>(null);

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
      imageUrl,
      dateCreated:
        playlistToEdit?.dateCreated ||
        new Date().toLocaleDateString('en-GB').split('T')[0],
      songs,
    };

    try {
      const result = playlistToEdit
        ? await updatePlaylist(playlistData)
        : await addPlaylist(playlistData);

      if (result.success) {
        drawer.close();
        toast.show(
          playlistToEdit
            ? 'Playlist updated successfully!'
            : 'Playlist added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save playlist');
      }
    } catch (error) {
      toast.show(
        `Error saving playlist: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const handleDelete = async () => {
    if (!playlistToEdit || !user) return;

    try {
      const result = await deletePlaylist(playlistToEdit.id);

      if (result.success) {
        drawer.close();
        toast.show('Playlist deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete playlist');
      }
    } catch (error) {
      toast.show(
        `Error deleting playlist: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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

    if (!newSong.title || !newSong.artist) {
      toast.show('Title and artist are required for a song.');
      return;
    }

    const songToAdd: Song = {
      id: newSong.id,
      title: newSong.title,
      artist: newSong.artist,
      imageUrl: newSong.imageUrl || '',
      audioUrl: newSong.audioUrl || '',
    };

    try {
      if (playlistToEdit) {
        const result = await addSongToPlaylist(playlistToEdit.id, songToAdd);

        if (result.success && result.song) {
          setSongs([...songs, result.song]);
          setNewSong({
            title: '',
            artist: '',
            imageUrl: '',
            audioUrl: '',
          });
          toast.show('Song added successfully!');
        } else {
          throw new Error(result.error || 'Failed to add song');
        }
      } else {
        const newSongWithId: Song = {
          id: generateId(newSong.title),
          dateAdded: new Date().toLocaleDateString('en-GB').split('T')[0],
          ...songToAdd,
        };
        setSongs([...songs, newSongWithId]);
        setNewSong({
          title: '',
          artist: '',
          imageUrl: '',
          audioUrl: '',
        });
        toast.show('Song added successfully!');
      }
    } catch (error) {
      toast.show(
        `Error adding song: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const handleUpdateSong = async (updatedSong: Song) => {
    if (!playlistToEdit) return;

    try {
      const updatedPlaylist = {
        ...playlistToEdit,
        songs: songs.map((song) =>
          song.id === updatedSong.id ? updatedSong : song,
        ),
      };

      const result = await updatePlaylist(updatedPlaylist);

      if (result.success) {
        setSongs(updatedPlaylist.songs);
        setEditingSong(null);
        modal.close();
        toast.show('Song updated successfully!');
      } else {
        throw new Error(result.error || 'Failed to update song');
      }
    } catch (error) {
      toast.show(
        `Error updating song: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlistToEdit) {
      setSongs(songs.filter((song) => song.id !== songId));
      return;
    }

    try {
      const result = await removeSongFromPlaylist(playlistToEdit.id, songId);

      if (result.success) {
        setSongs(songs.filter((song) => song.id !== songId));
        toast.show('Song removed successfully!');
      } else {
        throw new Error(result.error || 'Failed to remove song');
      }
    } catch (error) {
      toast.show(
        `Error removing song: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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

  return (
    <>
      {/* Header */}
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6 border-b dark:border-gray-700'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-lg font-semibold'>
            {playlistToEdit ? 'Edit Playlist' : 'Create New Playlist'}
          </h1>
          <Button icon='close' onClick={() => drawer.close()}>
            <span className='hidden lg:block'>Close</span>
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
              imageUrl={imageUrl || '/images/placeholder.png'}
              dateCreated={
                playlistToEdit?.dateCreated ||
                new Date().toLocaleDateString('en-GB').split('T')[0]
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
                    Audio URL
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
                <Button icon='plus' type='primary' onClick={handleAddSong}>
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
                <Button icon='trash' type='destructive' onClick={confirmDelete}>
                  Delete
                </Button>
              )}
              <Button icon='floppyDisk' type='primary' onClick={handleSubmit}>
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
