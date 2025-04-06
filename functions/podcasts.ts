import { database, ref, get, set, remove, onValue } from '@/lib/firebase';
import { Podcast } from '@/types/podcast';

/**
 * Subscribe to podcasts changes in Firebase
 * @param callback Function to call when data changes
 * @returns Unsubscribe function
 */
export function podcastsData(callback: (data: Podcast[]) => void) {
  const podcastRef = ref(database, 'podcasts');

  return onValue(podcastRef, (snapshot) => {
    const data = snapshot.exists()
      ? Object.entries(snapshot.val()).map(
          ([id, podcast]: [string, Omit<Podcast, 'id'>]) => ({
            id,
            ...podcast,
          }),
        )
      : [];
    callback(data);
  });
}

/**
 * Fetch all podcasts from Firebase
 * @returns Promise with array of podcasts
 */
export async function getPodcasts(): Promise<Podcast[]> {
  try {
    const podcastRef = ref(database, 'podcasts');
    const snapshot = await get(podcastRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const podcasts = Object.entries(data).map(
        ([id, podcast]: [string, Omit<Podcast, 'id'>]) => ({
          id,
          ...podcast,
        }),
      );
      return podcasts;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw new Error('Failed to fetch podcasts');
  }
}

/**
 * Add a new podcast to Firebase
 * @param data podcast data to add
 * @returns Promise with operation result
 */
export async function addPodcast(
  data: Omit<Podcast, 'dateAdded'>,
): Promise<{ success: boolean; podcast?: Podcast; error?: string }> {
  try {
    const { id, title, description, imageURL, link } = data;

    if (!id || !title || !description || !link) {
      return { success: false, error: 'Missing required fields' };
    }

    const newPodcast: Podcast = {
      id,
      title,
      description,
      imageURL,
      link,
    };

    const newPodcastRef = ref(database, `podcasts/${newPodcast.id}`);
    await set(newPodcastRef, newPodcast);

    return { success: true, podcast: newPodcast };
  } catch (error) {
    console.error('Error adding podcast:', error);
    return { success: false, error: 'Failed to add podcast' };
  }
}

/**
 * Update an existing podcast in Firebase
 * @param data Updated podcast data
 * @returns Promise with operation result
 */
export async function updatePodcast(
  data: Podcast,
): Promise<{ success: boolean; podcast?: Podcast; error?: string }> {
  try {
    const { id, title, description, imageURL, link } = data;

    if (!id || !title || !description || !link) {
      return { success: false, error: 'Missing required fields' };
    }

    const updatedPodcast: Podcast = {
      id,
      title,
      description,
      imageURL,
      link,
    };

    const podcastRef = ref(database, `podcasts/${id}`);
    await set(podcastRef, updatedPodcast);

    return { success: true, podcast: updatedPodcast };
  } catch (error) {
    console.error('Error updating podcast:', error);
    return { success: false, error: 'Failed to update podcast' };
  }
}

/**
 * Delete a podcast from Firebase
 * @param id ID of the podcast to delete
 * @returns Promise with operation result
 */
export async function deletePodcast(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: 'Podcast ID is required' };
    }

    const podcastRef = ref(database, `podcasts/${id}`);
    await remove(podcastRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return { success: false, error: 'Failed to delete podcast' };
  }
}
