import pb from '@/lib/pocketbase';
import { Podcast } from '@/types/podcast';
import { RecordModel } from 'pocketbase';
import { generateId } from '@/utilities/generateId';

/**
 * Fetches and subscribes to podcasts data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function podcastsData(callback: (data: Podcast[]) => void) {
  const fetchAll = async () => {
    try {
      const data = await pb
        .collection('podcasts')
        .getFullList<Podcast>({ sort: '-created' });
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAll();

  pb.collection('podcasts').subscribe('*', fetchAll);

  return () => pb.collection('podcasts').unsubscribe();
}

/**
 * Fetches all podcasts from the database.
 * @returns Promise with array of podcasts.
 */
export async function getPodcasts(): Promise<Podcast[]> {
  try {
    return await pb
      .collection('podcasts')
      .getFullList<Podcast>({ sort: '-created' });
  } catch {
    return [];
  }
}

/**
 * Adds a new podcast to the database.
 * @param data Podcast data without ID.
 * @returns Promise with operation result.
 */
export async function addPodcast(
  data: Omit<Podcast, 'id'>,
): Promise<{ success: boolean; podcast?: Podcast; error?: string }> {
  try {
    const record = await pb.collection('podcasts').create<Podcast>(data);
    return { success: true, podcast: record };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing podcast in the database.
 * @param data Updated podcast data.
 * @returns Promise with operation result.
 */
export async function updatePodcast(
  data: Podcast,
): Promise<{ success: boolean; podcast?: Podcast; error?: string }> {
  try {
    const { id, ...rest } = data;
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('podcasts')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    const record = await pb
      .collection('podcasts')
      .update<Podcast>(recordId, rest);
    return { success: true, podcast: record };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a podcast from the database.
 * @param id ID or slug of the podcast.
 * @returns Promise with operation result.
 */
export async function deletePodcast(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('podcasts')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('podcasts').delete(recordId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
