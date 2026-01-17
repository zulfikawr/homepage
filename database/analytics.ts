import pb from '@/lib/pocketbase';

/**
 * Increments the view count for a specific page path.
 * @param path The URL path of the page.
 */
export async function incrementPageViews(path: string): Promise<void> {
  try {
    let record;
    try {
      record = await pb
        .collection('page_views')
        .getFirstListItem(`path="${path}"`);
      await pb.collection('page_views').update(record.id, {
        'count+': 1,
      });
    } catch {
      await pb.collection('page_views').create({
        path,
        count: 1,
      });
    }
  } catch {
    // Silent fail per "remove all prints" request
  }
}

/**
 * Subscribes to view count changes for a specific path.
 * @param path The URL path to watch.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function getPageViews(
  path: string,
  callback: (views: number) => void,
): () => void {
  pb.collection('page_views')
    .getFirstListItem(`path="${path}"`)
    .then((record) => callback(record.count))
    .catch(() => callback(0));

  pb.collection('page_views').subscribe('*', async (e) => {
    if (e.record.path === path) {
      callback(e.record.count);
    }
  });

  return () => pb.collection('page_views').unsubscribe();
}

/**
 * Fetches and subscribes to all page view counts.
 * @param callback Function to call with updated views object.
 * @returns Unsubscribe function.
 */
export function getAllPageViews(
  callback: (views: { [key: string]: number }) => void,
): () => void {
  const fetchAll = async () => {
    try {
      const records = await pb.collection('page_views').getFullList();
      const views: { [key: string]: number } = {};
      records.forEach((r) => (views[r.path] = r.count));
      callback(views);
    } catch {
      callback({});
    }
  };

  fetchAll();

  pb.collection('page_views').subscribe('*', fetchAll);

  return () => pb.collection('page_views').unsubscribe();
}
