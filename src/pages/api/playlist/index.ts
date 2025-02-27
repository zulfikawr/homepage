import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get, set, remove } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
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

// Handle GET requests (fetch playlists)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const playlistsRef = ref(database, 'playlists');
    const snapshot = await get(playlistsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const playlists = Object.entries(data).map(
        ([id, playlist]: [string, any]) => ({
          id,
          ...playlist,
        }),
      );

      return res.status(200).json({ playlists });
    } else {
      return res.status(200).json({ playlists: [] });
    }
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json({ error: 'Failed to fetch playlists' });
  }
}

// Handle POST requests (add a new playlist)
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, description, imageUrl, songs } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const newPlaylist = {
      id,
      name,
      description: description || '',
      imageUrl: imageUrl || '/images/playlists/default.jpg',
      dateCreated: new Date().toISOString().split('T')[0],
      songs: songs || [],
    };

    const newPlaylistRef = ref(database, `playlists/${newPlaylist.id}`);
    await set(newPlaylistRef, newPlaylist);

    return res.status(201).json({
      message: 'Playlist created successfully',
      playlist: newPlaylist,
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    return res.status(500).json({ error: 'Failed to create playlist' });
  }
}

// Handle PUT requests (edit a playlist)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, description, imageUrl, songs } = req.body;

    if (!id || !name) {
      return res
        .status(400)
        .json({ error: 'Playlist ID and name are required' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    const snapshot = await get(playlistRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    const existingPlaylist = snapshot.val();

    const updatedPlaylist = {
      ...existingPlaylist,
      name,
      description: description || existingPlaylist.description,
      imageUrl: imageUrl || existingPlaylist.imageUrl,
      songs: songs || existingPlaylist.songs,
    };

    await set(playlistRef, updatedPlaylist);

    return res.status(200).json({
      message: 'Playlist updated successfully',
      playlist: updatedPlaylist,
    });
  } catch (error) {
    console.error('Error updating playlist:', error);
    return res.status(500).json({ error: 'Failed to update playlist' });
  }
}

// Handle DELETE requests (delete a playlist)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    await remove(playlistRef);

    return res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return res.status(500).json({ error: 'Failed to delete playlist' });
  }
}
