import { ref, get, set, increment, onValue } from 'firebase/database';
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
 * Subscribe to page views changes for a specific path
 * @param path The path to the page (e.g., '/home', '/blog/post-1')
 * @param callback Function to call when data changes with the view count
 * @returns Unsubscribe function
 */
export function getPageViews(
  path: string,
  callback: (views: number) => void,
): () => void {
  const viewsRef = ref(database, `pageViews${path}`);

  return onValue(viewsRef, (snapshot) => {
    const views = snapshot.exists() ? snapshot.val() : 0;
    callback(views);
  });
}

/**
 * Subscribe to all page views changes
 * @param callback Function to call when data changes with all routes' view counts
 * @returns Unsubscribe function
 */
export function getAllPageViews(
  callback: (views: { [key: string]: number }) => void,
): () => void {
  const viewsRef = ref(database, 'pageViews');

  return onValue(viewsRef, (snapshot) => {
    const views = snapshot.exists() ? snapshot.val() : {};
    callback(views);
  });
}
