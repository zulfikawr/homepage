import { ref, get, set, increment } from 'firebase/database';
import { database } from '@/lib/firebase';

/**
 * Increment page views in Firebase Realtime Database
 * @param path The path to the page (e.g., '/home', '/blog/post-1')
 */
export async function incrementPageViews(path: string): Promise<void> {
  try {
    const viewsRef = ref(database, `pageViews${path}`);
    await set(viewsRef, increment(1));
  } catch (error) {
    console.error('Error incrementing page views:', error);
    throw new Error('Failed to increment page views');
  }
}

/**
 * Fetch total page views for a specific path
 * @param path The path to the page (e.g., '/home', '/blog/post-1')
 * @returns Promise with the total page views
 */
export async function getPageViews(path: string): Promise<number> {
  try {
    const viewsRef = ref(database, `pageViews${path}`);
    const snapshot = await get(viewsRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Error fetching page views:', error);
    throw new Error('Failed to fetch page views');
  }
}

/**
 * Fetch total page views for all routes
 * @returns Promise with the total page views for all routes
 */
export async function getAllPageViews(): Promise<{ [key: string]: number }> {
  try {
    const viewsRef = ref(database, 'pageViews');
    const snapshot = await get(viewsRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error('Error fetching all page views:', error);
    throw new Error('Failed to fetch all page views');
  }
}
