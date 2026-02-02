'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

import { getBucket, getDB } from '@/lib/cloudflare';
import { Book } from '@/types/book';

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
  return {
    id: row.id,
    slug: row.slug,
    type: row.type as Book['type'],
    title: row.title,
    author: row.author,
    imageURL: row.image_url,
    link: row.link,
    dateAdded: row.date_added,
  };
}

async function uploadFile(file: File): Promise<string> {
  const bucket = getBucket();
  if (!bucket) throw new Error('Storage binding (BUCKET) not found');
  const key = `book-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const arrayBuffer = await file.arrayBuffer();
  await bucket.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  });
  return `/api/storage/${key}`;
}

export async function getBooks(): Promise<Book[]> {
  try {
    const db = getDB();
    if (!db) return [];
    const { results } = await db
      .prepare('SELECT * FROM books ORDER BY created_at DESC')
      .all<BookRow>();
    return results.map(mapRowToBook).filter((b): b is Book => b !== null);
  } catch (error) {
    console.error('[Database] Failed to fetch books:', error);
    return [];
  }
}

export async function addBook(
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
      payload.dateAdded = data.get('dateAdded') as string;

      const imageFile = data.get('imageURL') as File | null;
      const imageUrlInput = data.get('image_url') as string | null;

      if (imageFile && imageFile.size > 0) {
        payload.imageURL = await uploadFile(imageFile);
      } else if (imageUrlInput) {
        payload.imageURL = imageUrlInput.replace('/api/storage/', '');
      }
    } else {
      payload = { ...data };
    }

    if (!payload.slug) {
      payload.slug =
        payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || id;
    }

    await db
      .prepare(
        `INSERT INTO books (id, slug, type, title, author, image_url, link, date_added) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        payload.slug,
        payload.type,
        payload.title,
        payload.author,
        payload.imageURL || '',
        payload.link || '',
        payload.dateAdded || '',
      )
      .run();

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('reading_list', 'max');

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
      payload.dateAdded = data.get('dateAdded') as string;

      const imageFile = data.get('imageURL') as File | null;
      const imageUrlInput = data.get('image_url') as string | null;

      if (imageFile && imageFile.size > 0) {
        payload.imageURL = await uploadFile(imageFile);
      } else if (imageUrlInput) {
        payload.imageURL = imageUrlInput.replace('/api/storage/', '');
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
    if (payload.dateAdded !== undefined) {
      fields.push('date_added = ?');
      values.push(payload.dateAdded);
    }
    if (payload.imageURL !== undefined) {
      fields.push('image_url = ?');
      values.push(payload.imageURL);
    }

    if (fields.length > 0) {
      values.push(recordId);
      await db
        .prepare(`UPDATE books SET ${fields.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
    }

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('reading_list', 'max');

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

    await db.prepare('DELETE FROM books WHERE id = ?').bind(existing.id).run();

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('reading_list', 'max');

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
  try {
    const db = getDB();
    if (!db) return null;
    const row = await db
      .prepare('SELECT * FROM books WHERE id = ? OR slug = ?')
      .bind(id, id)
      .first<BookRow>();
    return mapRowToBook(row);
  } catch (error) {
    console.error('[Database] Failed to get book by ID:', error);
    return null;
  }
}
