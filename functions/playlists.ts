import { database, ref, get, set, remove } from '@/lib/firebase';
import { Playlist, Song } from '@/types/playlist';

/**
 * Fetch all playlists from Firebase
 */
export async function getPlaylists(): Promise<Playlist[]> {
  try {
    const playlistRef = ref(database, 'playlists');
    const snapshot = await get(playlistRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const playlists = Object.entries(data).map(
        ([id, playlist]: [string, Omit<Playlist, 'id'>]) => ({
          id,
          ...playlist,
        }),
      );
      return playlists;
    }
    return [];
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw new Error('Failed to fetch playlists');
  }
}

/**
 * Add a new playlist to Firebase
 */
export async function addPlaylist(
  data: Playlist,
): Promise<{ success: boolean; playlist?: Playlist; error?: string }> {
  try {
    const { id, name, description, imageUrl, dateCreated, songs } = data;

    if (!name || !description) {
      return { success: false, error: 'Missing required fields' };
    }

    const newPlaylist: Playlist = {
      id,
      name,
      description,
      imageUrl,
      dateCreated,
      songs: songs || [],
    };

    const playlistRef = ref(database, `playlists/${newPlaylist.id}`);
    await set(playlistRef, newPlaylist);

    return { success: true, playlist: newPlaylist };
  } catch (error) {
    console.error('Error adding playlist:', error);
    return { success: false, error: 'Failed to add playlist' };
  }
}

/**
 * Update an existing playlist in Firebase
 */
export async function updatePlaylist(
  data: Playlist,
): Promise<{ success: boolean; playlist?: Playlist; error?: string }> {
  try {
    const { id, name, description, imageUrl, songs } = data;

    if (!id || !name || !description) {
      return { success: false, error: 'Missing required fields' };
    }

    const playlistRef = ref(database, `playlists/${id}`);
    await set(playlistRef, data);

    return { success: true, playlist: data };
  } catch (error) {
    console.error('Error updating playlist:', error);
    return { success: false, error: 'Failed to update playlist' };
  }
}

/**
 * Delete a playlist from Firebase
 */
export async function deletePlaylist(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: 'Playlist ID is required' };
    }

    const playlistRef = ref(database, `playlists/${id}`);
    await remove(playlistRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return { success: false, error: 'Failed to delete playlist' };
  }
}

/**
 * Add a song to a playlist
 */
export async function addSongToPlaylist(
  playlistId: string,
  song: Song,
): Promise<{ success: boolean; song?: Song; error?: string }> {
  try {
    const { id, title, artist, imageUrl, dateAdded, audioUrl } = song;

    if (!playlistId || !title || !artist) {
      return { success: false, error: 'Missing required fields' };
    }

    const newSong: Song = {
      id,
      title,
      artist,
      imageUrl,
      audioUrl,
      dateAdded,
    };

    const playlistRef = ref(database, `playlists/${playlistId}`);
    const snapshot = await get(playlistRef);

    if (snapshot.exists()) {
      const playlist = snapshot.val();
      const updatedSongs = [...(playlist.songs || []), newSong];
      await set(playlistRef, { ...playlist, songs: updatedSongs });
      return { success: true, song: newSong };
    }

    return { success: false, error: 'Playlist not found' };
  } catch (error) {
    console.error('Error adding song:', error);
    return { success: false, error: 'Failed to add song' };
  }
}

/**
 * Remove a song from a playlist
 */
export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!playlistId || !songId) {
      return { success: false, error: 'Playlist ID and Song ID are required' };
    }

    const playlistRef = ref(database, `playlists/${playlistId}`);
    const snapshot = await get(playlistRef);

    if (snapshot.exists()) {
      const playlist = snapshot.val();
      const updatedSongs = playlist.songs.filter(
        (song: Song) => song.id !== songId,
      );
      await set(playlistRef, { ...playlist, songs: updatedSongs });
      return { success: true };
    }

    return { success: false, error: 'Playlist not found' };
  } catch (error) {
    console.error('Error removing song:', error);
    return { success: false, error: 'Failed to remove song' };
  }
}
