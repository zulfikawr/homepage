import pb from '@/lib/pocketbase';
import { Post } from '@/types/post';
import { RecordModel } from 'pocketbase';
import { generateId } from '@/utilities/generateId';

/**
 * Fetches and subscribes to posts data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function postsData(callback: (data: Post[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('posts')
        .getFullList<RecordModel>({ sort: '-created' });
      const data: Post[] = records.map((record) => ({
        id: record.id,
        title: record.title,
        content: record.content,
        excerpt: record.excerpt,
        dateString: record.dateString,
        img: record.img,
        audioUrl: record.audioUrl,
        categories:
          typeof record.categories === 'string'
            ? JSON.parse(record.categories)
            : record.categories,
      }));
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('posts').subscribe('*', fetchAndCallback);

  return () => pb.collection('posts').unsubscribe();
}

/**
 * Fetches all posts from the database.
 * @returns Promise with array of posts.
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const records = await pb
      .collection('posts')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map((record) => ({
      id: record.id,
      title: record.title,
      content: record.content,
      excerpt: record.excerpt,
      dateString: record.dateString,
      img: record.img,
      audioUrl: record.audioUrl,
      categories:
        typeof record.categories === 'string'
          ? JSON.parse(record.categories)
          : record.categories,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches a single post by ID or slug.
 * @param id ID or slug of the post.
 * @returns Promise with the post data or null.
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    let record: RecordModel;
    if (id.length === 15) {
      record = await pb.collection('posts').getOne<RecordModel>(id);
    } else {
      record = await pb
        .collection('posts')
        .getFirstListItem<RecordModel>(`slug="${id}"`);
    }
    return {
      id: record.id,
      title: record.title,
      content: record.content,
      excerpt: record.excerpt,
      dateString: record.dateString,
      img: record.img,
      audioUrl: record.audioUrl,
      categories:
        typeof record.categories === 'string'
          ? JSON.parse(record.categories)
          : record.categories,
    };
  } catch {
    return null;
  }
}

/**
 * Adds a new post to the database.
 * @param data Post data without ID.
 * @returns Promise with operation result.
 */
export async function addPost(
  data: Omit<Post, 'id'>,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const record = await pb.collection('posts').create<RecordModel>(data);
    return { success: true, post: record };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing post in the database.
 * @param id ID or slug of the post.
 * @param data Updated post data.
 * @returns Promise with operation result.
 */
export async function updatePost(
  id: string,
  data: Partial<Post>,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('posts')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    const record = await pb.collection('posts').update<Post>(recordId, data);
    return { success: true, post: record };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a post from the database.
 * @param id ID or slug of the post.
 * @returns Promise with operation result.
 */
export async function deletePost(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('posts')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('posts').delete(recordId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
