import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get, set } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handle POST requests (add a song to a playlist)
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { title, artist, imageUrl, audioUrl, duration } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    const snapshot = await get(playlistRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const playlist = snapshot.val();
    const songs = playlist.songs || [];

    const newSong = {
      id: Date.now().toString(),
      title,
      artist,
      imageUrl: imageUrl || '/images/songs/default.jpg',
      audioUrl,
      duration: duration || '0:00',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    songs.push(newSong);

    await set(playlistRef, {
      ...playlist,
      songs,
    });

    return res
      .status(201)
      .json({ message: 'Song added successfully', song: newSong });
  } catch (error) {
    console.error('Error adding song:', error);
    return res.status(500).json({ error: 'Failed to add song' });
  }
}

// Handle PUT requests (update a song in a playlist)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { songId, title, artist, imageUrl, audioUrl, duration } = req.body;

    if (!id || Array.isArray(id) || !songId) {
      return res.status(400).json({ error: 'Invalid playlist ID or song ID' });
    }

    if (!title || !artist || !audioUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    const snapshot = await get(playlistRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const playlist = snapshot.val();
    const songs = playlist.songs || [];

    const songIndex = songs.findIndex((song: any) => song.id === songId);

    if (songIndex === -1) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }

    const updatedSong = {
      ...songs[songIndex],
      title,
      artist,
      imageUrl: imageUrl || songs[songIndex].imageUrl,
      audioUrl,
      duration: duration || songs[songIndex].duration,
    };

    songs[songIndex] = updatedSong;

    await set(playlistRef, {
      ...playlist,
      songs,
    });

    return res
      .status(200)
      .json({ message: 'Song updated successfully', song: updatedSong });
  } catch (error) {
    console.error('Error updating song:', error);
    return res.status(500).json({ error: 'Failed to update song' });
  }
}

// Handle DELETE requests (remove a song from a playlist)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { songId } = req.body;

    if (!id || Array.isArray(id) || !songId) {
      return res.status(400).json({ error: 'Invalid playlist ID or song ID' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    const snapshot = await get(playlistRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const playlist = snapshot.val();
    const songs = playlist.songs || [];

    const updatedSongs = songs.filter((song: any) => song.id !== songId);

    if (songs.length === updatedSongs.length) {
      return res.status(404).json({ error: 'Song not found in playlist' });
    }

    await set(playlistRef, {
      ...playlist,
      songs: updatedSongs,
    });

    return res.status(200).json({ message: 'Song removed successfully' });
  } catch (error) {
    console.error('Error removing song:', error);
    return res.status(500).json({ error: 'Failed to remove song' });
  }
}
