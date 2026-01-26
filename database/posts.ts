'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import { mapRecordToPost } from '@/lib/mappers';
import pb from '@/lib/pocketbase';
import { Post } from '@/types/post';

/**
 * Ensures the PocketBase client is authenticated for server-side operations
 * by loading the auth state from the request cookies.
 */
async function ensureAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
}

/**
 * Fetches all posts from the database.
 */
export async function getPosts(): Promise<Post[]> {
  'use cache';
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
  'use cache';
  try {
    if (id.length === 15) {
      try {
        const record = await pb.collection('posts').getOne<RecordModel>(id);
        if (record) return mapRecordToPost(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb.collection('posts').getFullList<RecordModel>({
      filter: `slug = "${id}"`,
      requestKey: null,
    });

    if (records.length > 0) {
      return mapRecordToPost(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Adds a new post to the database.
 */
export async function addPost(
  data: Omit<Post, 'id'> | FormData,
): Promise<{ success: boolean; post?: Post; error?: string }> {
  await ensureAuth();
  try {
    const record = await pb.collection('posts').create<RecordModel>(data);
    const post = mapRecordToPost(record);

    revalidatePath('/post');
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    return { success: true, post };
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
  await ensureAuth();
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
    const post = mapRecordToPost(record);

    revalidatePath('/post');
    revalidatePath(`/post/${post.slug}`);
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    return { success: true, post };
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
  await ensureAuth();
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
    await pb.collection('posts').delete(recordId);

    revalidatePath('/post');
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
