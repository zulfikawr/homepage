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

// Handle GET requests (fetch podcasts)
async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const podcastRef = ref(database, 'podcast');
    const snapshot = await get(podcastRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const podcasts = Object.entries(data).map(
        ([id, podcast]: [string, any]) => ({
          id,
          ...podcast,
        }),
      );

      return res.status(200).json({ podcasts });
    } else {
      return res.status(200).json({ podcasts: [] });
    }
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return res.status(500).json({ error: 'Failed to fetch podcast' });
  }
}

// Handle POST requests (add a new podcast)
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, title, description, imageURL, link } = req.body;

    if (!id || !title || !description || !imageURL || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPodcast = {
      id,
      title,
      description,
      imageURL: imageURL || '/images/podcasts/default.jpg',
      link,
    };

    const newPodcastRef = ref(database, `podcast/${newPodcast.id}`);
    await set(newPodcastRef, newPodcast);

    return res
      .status(201)
      .json({ message: 'Podcast added successfully', podcast: newPodcast });
  } catch (error) {
    console.error('Error adding podcast:', error);
    return res.status(500).json({ error: 'Failed to add podcast' });
  }
}

// Handle PUT requests (edit a podcast)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, title, description, imageURL, link } = req.body;

    if (!id || !title || !description || !imageURL || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedPodcast = {
      id,
      title,
      description,
      imageURL: imageURL || '/images/podcasts/default.jpg',
      link,
    };

    const podcastRef = ref(database, `podcast/${id}`);
    await set(podcastRef, updatedPodcast);

    return res.status(200).json({
      message: 'Podcast updated successfully',
      podcast: updatedPodcast,
    });
  } catch (error) {
    console.error('Error updating podcast:', error);
    return res.status(500).json({ error: 'Failed to update podcast' });
  }
}

// Handle DELETE requests (delete a podcast)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Podcast ID is required' });
    }

    const podcastRef = ref(database, `podcast/${id}`);
    await remove(podcastRef);

    return res.status(200).json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return res.status(500).json({ error: 'Failed to delete podcast' });
  }
}
