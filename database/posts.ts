'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { mapRecordToPost } from '@/lib/mappers';
import { Post } from '@/types/post';

interface PostRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  audio_url: string;
  categories: string;
  date_string: string;
}

/**
 * Uploads a file to R2 and returns the filename (key).
 */
async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage not available');

  const key = `post-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });

  return key;
}

/**
 * Fetches all posts from the database.
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const db = getDB();
    if (!db) return [];

    const { results } = await db
      .prepare('SELECT * FROM posts ORDER BY created_at DESC')
      .all<PostRow>();
    return results.map((row) => mapRecordToPost(row));
  } catch (e) {
    console.error('Error fetching posts:', e);
    return [];
  }
}

/**
 * Fetches a single post by ID or slug.
 */
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const db = getDB();
    if (!db) return null;

    const query = 'SELECT * FROM posts WHERE id = ? OR slug = ?';
    const row = await db.prepare(query).bind(id, id).first<PostRow>();

    if (!row) return null;
    return mapRecordToPost(row);
  } catch (e) {
    console.error('Error fetching post:', e);
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
    const db = getDB();
    const id = crypto.randomUUID();
    let payload: Partial<Post> = {};

    if (data instanceof FormData) {
      // Handle FormData
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.content = data.get('content') as string;
      payload.excerpt = data.get('excerpt') as string;
      payload.dateString = data.get('dateString') as string;

      const imageFile = data.get('image') as File;
      const imageUrlInput = data.get('image_url') as string;
      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile);
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }

      const audioFile = data.get('audio') as File;
      const audioUrlInput = data.get('audio_url') as string;
      if (audioFile && audioFile.size > 0) {
        payload.audio_url = await uploadFile(audioFile);
      } else if (audioUrlInput) {
        payload.audio_url = audioUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    // Default values
    if (!payload.slug)
      payload.slug =
        payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;

    const categoriesJson = JSON.stringify(payload.categories || []);

    await db
      .prepare(
        `INSERT INTO posts (id, slug, title, content, excerpt, image_url, audio_url, categories, date_string)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.title,
        payload.content,
        payload.excerpt,
        payload.image_url,
        payload.audio_url,
        categoriesJson,
        payload.dateString,
      )
      .run();

    revalidatePath('/posts');
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    const newPost = await getPostById(id);
    return { success: true, post: newPost! };
  } catch (error: unknown) {
    console.error('Add post error:', error);
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
    const db = getDB();
    let recordId = id;

    // Resolve ID if slug is passed
    const existing = await getPostById(id);
    if (!existing) return { success: false, error: 'Post not found' };
    recordId = existing.id;

    let payload: Partial<Post> = {};
    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.content = data.get('content') as string;
      payload.excerpt = data.get('excerpt') as string;
      payload.dateString = data.get('dateString') as string;

      const categoriesStr = data.get('categories') as string;
      if (categoriesStr) {
        try {
          payload.categories = JSON.parse(categoriesStr);
        } catch {
          payload.categories = [];
        }
      }

      const imageFile = data.get('image') as File;
      const imageUrlInput = data.get('image_url') as string;
      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile);
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }

      const audioFile = data.get('audio') as File;
      const audioUrlInput = data.get('audio_url') as string;
      if (audioFile && audioFile.size > 0) {
        payload.audio_url = await uploadFile(audioFile);
      } else if (audioUrlInput) {
        payload.audio_url = audioUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    // Dynamic Update Query
    const fields: string[] = [];
    const values: (string | number | boolean | null | undefined)[] = [];

    if (payload.title !== undefined) {
      fields.push('title = ?');
      values.push(payload.title);
    }
    if (payload.slug !== undefined) {
      fields.push('slug = ?');
      values.push(payload.slug);
    }
    if (payload.content !== undefined) {
      fields.push('content = ?');
      values.push(payload.content);
    }
    if (payload.excerpt !== undefined) {
      fields.push('excerpt = ?');
      values.push(payload.excerpt);
    }
    if (payload.image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(payload.image_url);
    }
    if (payload.audio_url !== undefined) {
      fields.push('audio_url = ?');
      values.push(payload.audio_url);
    }
    if (payload.categories !== undefined) {
      fields.push('categories = ?');
      values.push(JSON.stringify(payload.categories));
    }
    if (payload.dateString !== undefined) {
      fields.push('date_string = ?');
      values.push(payload.dateString);
    }

    if (fields.length > 0) {
      values.push(recordId);
      await db
        .prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/posts');
    revalidatePath(`/posts/${payload.slug || existing.slug}`);
    revalidatePath('/database/posts');
    revalidateTag('posts', 'max');

    const updated = await getPostById(recordId);
    return { success: true, post: updated! };
  } catch (error: unknown) {
    console.error('Update post error:', error);
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
    const db = getDB();
    // Resolve ID
    const existing = await getPostById(id);
    if (!existing) return { success: false, error: 'Post not found' };

    await db.prepare('DELETE FROM posts WHERE id = ?').bind(existing.id).run();

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
