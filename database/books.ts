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
 * Fetches all books from the database.
 */
export async function getBooks(): Promise<Book[]> {
  'use cache';
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
  data: Omit<Book, 'id'>,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  await ensureAuth();
  try {
    const record = await pb
      .collection('reading_list')
      .create<RecordModel>(data);
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
  data: Book,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  await ensureAuth();
  try {
    const { id, ...rest } = data;
    let recordId = id;

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
      .update<RecordModel>(recordId, rest);
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
  'use cache';
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
