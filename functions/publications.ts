import { generateId } from '@/utilities/generateId';
import { database, ref, get, set, remove, onValue } from '@/lib/firebase';
import { Publication } from '@/types/publication';

/**
 * Subscribe to publications changes in Firebase
 * @param callback Function to call when data changes
 * @returns Unsubscribe function
 */
export function publicationsData(callback: (data: Publication[]) => void) {
  const publicationsRef = ref(database, 'publications');

  return onValue(publicationsRef, (snapshot) => {
    const data = snapshot.exists()
      ? Object.entries(snapshot.val()).map(
          ([id, publication]: [string, Omit<Publication, 'id'>]) => ({
            id,
            ...publication,
          }),
        )
      : [];
    callback(data);
  });
}

/**
 * Fetch all publications from Firebase
 * @returns Promise with array of publications
 */
export async function getPublications(): Promise<Publication[]> {
  try {
    const pubsRef = ref(database, 'publications');
    const snapshot = await get(pubsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const publications = Object.entries(data).map(
        ([id, pub]: [string, Omit<Publication, 'id'>]) => ({
          id,
          ...pub,
        }),
      );
      return publications;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching publications:', error);
    throw new Error('Failed to fetch publications');
  }
}

/**
 * Add a new publication to Firebase
 * @param data Publication data to add
 * @returns Promise with operation result
 */
export async function addPublication(
  data: Omit<Publication, 'id'>,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  try {
    const { title, authors, publisher, excerpt, keywords, openAccess, link } =
      data;

    if (!title || !authors.length || !publisher || !excerpt || !link) {
      return { success: false, error: 'Missing required fields' };
    }

    const newPublication: Publication = {
      id: generateId(title),
      title,
      authors,
      publisher,
      excerpt,
      keywords: keywords || [],
      openAccess: openAccess || false,
      link,
    };

    const newPubRef = ref(database, `publications/${newPublication.id}`);
    await set(newPubRef, newPublication);

    return { success: true, publication: newPublication };
  } catch (error) {
    console.error('Error adding publication:', error);
    return { success: false, error: 'Failed to add publication' };
  }
}

/**
 * Update an existing publication in Firebase
 * @param data Updated publication data
 * @returns Promise with operation result
 */
export async function updatePublication(
  data: Publication,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  try {
    const {
      id,
      title,
      authors,
      publisher,
      excerpt,
      keywords,
      openAccess,
      link,
    } = data;

    if (!id || !title || !authors.length || !publisher || !excerpt || !link) {
      return { success: false, error: 'Missing required fields' };
    }

    const updatedPublication: Publication = {
      id,
      title,
      authors,
      publisher,
      excerpt,
      keywords: keywords || [],
      openAccess: openAccess || false,
      link,
    };

    const pubRef = ref(database, `publications/${id}`);
    await set(pubRef, updatedPublication);

    return { success: true, publication: updatedPublication };
  } catch (error) {
    console.error('Error updating publication:', error);
    return { success: false, error: 'Failed to update publication' };
  }
}

/**
 * Delete a publication from Firebase
 * @param id ID of the publication to delete
 * @returns Promise with operation result
 */
export async function deletePublication(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: 'Publication ID is required' };
    }

    const pubRef = ref(database, `publications/${id}`);
    await remove(pubRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting publication:', error);
    return { success: false, error: 'Failed to delete publication' };
  }
}

/**
 * Get a single publication by ID from Firebase
 * @param id ID of the publication to fetch
 * @returns Promise with the publication or null if not found
 */
export async function getPublicationById(
  id: string,
): Promise<Publication | null> {
  try {
    if (!id) throw new Error('Publication ID is required');

    const publicationRef = ref(database, `publications/${id}`);
    const snapshot = await get(publicationRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    return { id, ...data };
  } catch (error) {
    console.error('Error fetching publication by ID:', error);
    return null;
  }
}
