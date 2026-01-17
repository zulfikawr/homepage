import pb from '@/lib/pocketbase';
import { Post } from '@/types/post';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Post object with full URLs for files.
 */
function mapRecordToPost(record: RecordModel): Post {
  // Image logic: prioritize file, fallback to text url
  let image = (record.image as string) || (record.image_url as string) || '';
  if (image) {
    if (image.startsWith('http')) {
      // already a full URL
    } else if (image.startsWith('/')) {
      // local asset
    } else {
      // PocketBase filename
      image = pb.files.getUrl(
        { collectionName: 'posts', id: record.id } as unknown as RecordModel,
        image,
      );
    }
  }

  // Audio logic: prioritize file, fallback to text url
  let audio = (record.audio as string) || (record.audio_url as string) || '';
  if (audio) {
    if (audio.startsWith('http')) {
      // already a full URL
    } else if (audio.startsWith('/')) {
      // local asset
    } else {
      // PocketBase filename
      audio = pb.files.getUrl(
        { collectionName: 'posts', id: record.id } as unknown as RecordModel,
        audio,
      );
    }
  }

  return {
    id: record.id,
    title: record.title,
    content: record.content,
    excerpt: record.excerpt,
    dateString: record.dateString,
    image,
    image_url: record.image_url,
    audio,
    audio_url: record.audio_url,
    slug: record.slug,
    categories:
      typeof record.categories === 'string'
        ? JSON.parse(record.categories)
        : record.categories,
  };
}

/**
 * Fetches and subscribes to posts data.
 */
export function postsData(callback: (data: Post[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('posts')
        .getFullList<RecordModel>({ sort: '-created' });
      callback(records.map(mapRecordToPost));
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
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const records = await pb
      .collection('posts')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToPost);
  } catch {
    return [];
  }
}

/**
 * Fetches a single post by ID or slug.
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    if (id.length === 15) {
      try {
        const record = await pb.collection('posts').getOne<RecordModel>(id);
        if (record) return mapRecordToPost(record);
      } catch (e) {}
    }

    const records = await pb.collection('posts').getFullList<RecordModel>({
      filter: `slug = "${id}"`,
      requestKey: null,
    });

    if (records.length > 0) {
      return mapRecordToPost(records[0]);
    }

    return null;
  } catch (error) {
    console.error('getPostById error:', error);
    return null;
  }
}

/**
 * Adds a new post to the database.
 */
export async function addPost(
  data: Omit<Post, 'id'> | FormData,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    const record = await pb.collection('posts').create<RecordModel>(data);
    return { success: true, post: mapRecordToPost(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing post in the database.
 */
export async function updatePost(
  id: string,
  data: Partial<Post> | FormData,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb.collection('posts').getFullList<RecordModel>({
        filter: `slug = "${id}"`,
      });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('posts').getOne(id);
      } catch {
        const records = await pb.collection('posts').getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    const record = await pb
      .collection('posts')
      .update<RecordModel>(recordId, data);
    return { success: true, post: mapRecordToPost(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a post from the database.
 */
export async function deletePost(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb.collection('posts').getFullList<RecordModel>({
        filter: `slug = "${id}"`,
      });
      if (records.length > 0) recordId = records[0].id;
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
