'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import { mapRecordToBook } from '@/lib/mappers';
import pb from '@/lib/pocketbase';
import { Book } from '@/types/book';

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
 * Helper to clean book data before sending to PocketBase.
 */
function cleanBookData(data: Omit<Book, 'id'> | Book): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...data };

  // Handle imageURL field
  if (typeof clean.imageURL === 'string') {
    if (clean.imageURL.includes('/api/files/')) {
      const parts = clean.imageURL.split('/');
      clean.imageURL = parts[parts.length - 1].split('?')[0];
    }
  }

  // Remove ID
  if ('id' in clean) {
    delete clean.id;
  }

  return clean;
}

/**
 * Fetches all books from the database.
 */
export async function getBooks(): Promise<Book[]> {
  try {
    const records = await pb
      .collection('reading_list')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToBook);
  } catch {
    return [];
  }
}

/**
 * Adds a new book to the database.
 */
export async function addBook(
  data: Omit<Book, 'id'> | FormData,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  await ensureAuth();
  try {
    const payload =
      data instanceof FormData
        ? data
        : (cleanBookData(data) as Record<string, unknown>);
    const record = await pb
      .collection('reading_list')
      .create<RecordModel>(payload);
    const book = mapRecordToBook(record);

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('reading_list', 'max');

    return { success: true, book };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing book in the database.
 */
export async function updateBook(
  data: Book | FormData,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  await ensureAuth();
  try {
    let recordId: string;
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      const formId = data.get('id') as string;
      // If id is in FormData, use it, but remove from payload
      if (formId) recordId = formId;
      else throw new Error('ID is required for update');

      const formData = new FormData();
      data.forEach((value, key) => {
        if (key !== 'id') {
          formData.append(key, value);
        }
      });
      updateData = formData;
    } else {
      recordId = data.id;
      updateData = cleanBookData(data);
    }

    if (recordId.length !== 15) {
      const records = await pb
        .collection('reading_list')
        .getFullList<RecordModel>({
          filter: `slug = "${recordId}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('reading_list').getOne(recordId);
      } catch {
        const records = await pb
          .collection('reading_list')
          .getFullList<RecordModel>({
            filter: `slug = "${recordId}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }

    const record = await pb
      .collection('reading_list')
      .update<RecordModel>(recordId, updateData);
    const book = mapRecordToBook(record);

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('reading_list', 'max');

    return { success: true, book };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a book from the database.
 */
export async function deleteBook(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb
        .collection('reading_list')
        .getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('reading_list').getOne(id);
      } catch {
        const records = await pb
          .collection('reading_list')
          .getFullList<RecordModel>({
            filter: `slug = "${id}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('reading_list').delete(recordId);

    revalidatePath('/reading-list');
    revalidatePath('/database/reading-list');
    revalidateTag('reading_list', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single book by ID or slug.
 */
export async function getBookById(id: string): Promise<Book | null> {
  try {
    if (id.length === 15) {
      try {
        const record = await pb
          .collection('reading_list')
          .getOne<RecordModel>(id);
        if (record) return mapRecordToBook(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb
      .collection('reading_list')
      .getFullList<RecordModel>({
        filter: `slug = "${id}"`,
        requestKey: null,
      });

    if (records.length > 0) {
      return mapRecordToBook(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
