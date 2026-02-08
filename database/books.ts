'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { Book } from '@/types/book';

import { executeQuery, executeQueryFirst, executeUpdate } from './base';

interface BookRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  type: string;
  title: string;
  author: string;
  image_url: string;
  link: string;
  date_added: string;
}

function mapRowToBook(row: BookRow | null): Book | null {
  if (!row) return null;
  const imageKey = row.image_url;
  return {
    id: row.id,
    slug: row.slug,
    type: row.type as Book['type'],
    title: row.title,
    author: row.author,
    image: imageKey ? `/api/storage/${imageKey}` : '',
    image_url: imageKey || '',
    link: row.link,
    date_added: row.date_added,
  };
}

async function uploadFile(file: File, slug: string): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage binding (BUCKET) not found');

  const fileExt = file.name.split('.').pop() || 'jpg';
  const key = `books/${slug}/image.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer();
  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });
  return key;
}

export async function getBooks(): Promise<Book[]> {
  const results = await executeQuery<BookRow>(
    'SELECT * FROM books ORDER BY created_at DESC',
  );
  return results.map(mapRowToBook).filter((b): b is Book => b !== null);
}

export async function createBook(
  data: Omit<Book, 'id'> | FormData,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const id = crypto.randomUUID();
    let payload: Partial<Book> = {};

    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.author = data.get('author') as string;
      payload.type = data.get('type') as Book['type'];
      payload.link = data.get('link') as string;
      payload.date_added = data.get('date_added') as string;

      const imageFile = data.get('image') as File | null;
      const imageUrlInput = data.get('image_url') as string | null;

      // Generate slug first if not provided for addBook
      if (!payload.slug) {
        payload.slug =
          payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
      }

      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile, payload.slug);
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    if (!payload.slug) {
      payload.slug =
        payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
    }

    await executeUpdate(
      `INSERT INTO books (id, slug, type, title, author, image_url, link, date_added) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        payload.slug,
        payload.type,
        payload.title,
        payload.author,
        payload.image_url || '',
        payload.link || '',
        payload.date_added || '',
      ],
    );

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('readingList', 'max');

    const newBook = await getBookById(id);
    if (!newBook) throw new Error('Failed to retrieve book after creation');

    return { success: true, book: newBook };
  } catch (error) {
    console.error('[Database] Failed to add book:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateBook(
  data: Book | FormData,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    let recordId =
      data instanceof FormData ? (data.get('id') as string) : data.id;
    const existing = await getBookById(recordId);
    if (!existing) return { success: false, error: 'Book not found' };
    recordId = existing.id;

    let payload: Partial<Book> = {};
    if (data instanceof FormData) {
      payload.title = data.get('title') as string;
      payload.slug = data.get('slug') as string;
      payload.author = data.get('author') as string;
      payload.type = data.get('type') as Book['type'];
      payload.link = data.get('link') as string;
      payload.date_added = data.get('date_added') as string;

      const imageFile = data.get('image') as File | null;
      const imageUrlInput = data.get('image_url') as string | null;

      // Use existing slug or generate new one for updateBook
      const slug = payload.slug || existing.slug;

      if (imageFile && imageFile.size > 0) {
        payload.image_url = await uploadFile(imageFile, slug);
      } else if (imageUrlInput) {
        payload.image_url = imageUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    if (payload.title !== undefined) {
      fields.push('title = ?');
      values.push(payload.title);
    }
    if (payload.slug !== undefined) {
      fields.push('slug = ?');
      values.push(payload.slug);
    }
    if (payload.author !== undefined) {
      fields.push('author = ?');
      values.push(payload.author);
    }
    if (payload.type !== undefined) {
      fields.push('type = ?');
      values.push(payload.type);
    }
    if (payload.link !== undefined) {
      fields.push('link = ?');
      values.push(payload.link);
    }
    if (payload.date_added !== undefined) {
      fields.push('date_added = ?');
      values.push(payload.date_added);
    }
    if (payload.image_url !== undefined) {
      fields.push('image_url = ?');
      values.push(payload.image_url);
    }

    if (fields.length > 0) {
      values.push(recordId);
      await executeUpdate(
        `UPDATE books SET ${fields.join(', ')} WHERE id = ?`,
        values,
      );
    }

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('readingList', 'max');

    const updated = await getBookById(recordId);
    return { success: true, book: updated! };
  } catch (error) {
    console.error('[Database] Failed to update book:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteBook(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    if (!db) throw new Error('Database binding (DB) not found');

    const existing = await getBookById(id);
    if (!existing) return { success: false, error: 'Book not found' };

    await executeUpdate('DELETE FROM books WHERE id = ?', [existing.id]);

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('readingList', 'max');

    return { success: true };
  } catch (error) {
    console.error('[Database] Failed to delete book:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  const row = await executeQueryFirst<BookRow>(
    'SELECT * FROM books WHERE id = ? OR slug = ?',
    [id, id],
  );
  return mapRowToBook(row);
}
