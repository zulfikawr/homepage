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
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handle GET requests (fetch a specific playlist)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    const snapshot = await get(playlistRef);

    if (snapshot.exists()) {
      const playlist = snapshot.val();
      return res.status(200).json({ playlist: { id, ...playlist } });
    } else {
      return res.status(404).json({ error: 'Playlist not found' });
    }
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return res.status(500).json({ error: 'Failed to fetch playlist' });
  }
}

// Handle PUT requests (update a playlist)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, description, imageUrl } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
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
    };

    await set(playlistRef, updatedPlaylist);

    return res.status(200).json({
      message: 'Playlist updated successfully',
      playlist: { id, ...updatedPlaylist },
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

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid playlist ID' });
    }

    const playlistRef = ref(database, `playlists/${id}`);
    await remove(playlistRef);

    return res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    return res.status(500).json({ error: 'Failed to delete playlist' });
  }
}
