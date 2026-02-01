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
 * Maps a PocketBase record to a Post object with full URLs for images/audio.
 */
function cleanPostData(data: Omit<Post, 'id'> | Post): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...data };

  // Handle image field
  if (typeof clean.image === 'string') {
    if (clean.image.includes('/api/files/')) {
      const parts = clean.image.split('/');
      clean.image = parts[parts.length - 1].split('?')[0];
    } else if (clean.image.startsWith('http')) {
      clean.image_url = clean.image;
      clean.image = null;
    } else if (clean.image.startsWith('/')) {
      clean.image_url = clean.image;
      clean.image = null;
    }
  }

  // Handle audio field
  if (typeof clean.audio === 'string') {
    if (clean.audio.includes('/api/files/')) {
      const parts = clean.audio.split('/');
      clean.audio = parts[parts.length - 1].split('?')[0];
    } else if (clean.audio.startsWith('http')) {
      clean.audio_url = clean.audio;
      clean.audio = null;
    } else if (clean.audio.startsWith('/')) {
      clean.audio_url = clean.audio;
      clean.audio = null;
    }
  }

  // Ensure categories is stringified
  if (Array.isArray(clean.categories)) {
    clean.categories = JSON.stringify(clean.categories);
  }

  // Remove ID
  if ('id' in clean) {
    delete clean.id;
  }

  return clean;
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
    const payload =
      data instanceof FormData
        ? data
        : (cleanPostData(data) as Record<string, unknown>);
    const record = await pb.collection('posts').create<RecordModel>(payload);
    const post = mapRecordToPost(record);

    revalidatePath('/posts');
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    return { success: true, post };
  } catch (error: unknown) {
    const pbError = error as { data?: unknown; message?: string };
    return {
      success: false,
      error: pbError.message || String(pbError),
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
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      const formId = data.get('id') as string;
      if (formId) recordId = formId;
      const formData = new FormData();
      data.forEach((value, key) => {
        if (key !== 'id') {
          formData.append(key, value);
        }
      });
      updateData = formData;
    } else {
      recordId = data.id || id;
      updateData = cleanPostData(data as Post);
    }

    if (recordId.length !== 15) {
      const records = await pb.collection('posts').getFullList<RecordModel>({
        filter: `slug = "${recordId}"`,
      });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('posts').getOne(recordId);
      } catch {
        const records = await pb.collection('posts').getFullList<RecordModel>({
          filter: `slug = "${recordId}"`,
        });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    const record = await pb
      .collection('posts')
      .update<RecordModel>(recordId, updateData);
    const post = mapRecordToPost(record);

    revalidatePath('/posts');
    revalidatePath(`/posts/${post.slug}`);
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    return { success: true, post };
  } catch (error: unknown) {
    const pbError = error as { data?: unknown; message?: string };
    return {
      success: false,
      error: pbError.message || String(pbError),
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

    revalidatePath('/posts');
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
