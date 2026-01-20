'use server';

import pb from '@/lib/pocketbase';
import { Book } from '@/types/book';
import { RecordModel } from 'pocketbase';
import { revalidateTag } from 'next/cache';
import { mapRecordToBook } from './books.client';

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
  try {
    const record = await pb
      .collection('reading_list')
      .create<RecordModel>(data);
    const book = mapRecordToBook(record);
    try {
      revalidateTag('reading_list', 'max');
    } catch {
      // Ignore
    }
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
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      try {
        const record = await pb
          .collection('reading_list')
          .getFirstListItem(`slug="${recordId}"`);
        recordId = record.id;
      } catch {
        // Ignore if not found by slug
      }
    }

    const record = await pb
      .collection('reading_list')
      .update<RecordModel>(recordId, rest);
    const book = mapRecordToBook(record);
    try {
      revalidateTag('reading_list', 'max');
    } catch {
      // Ignore
    }
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
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('reading_list')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('reading_list').delete(recordId);
    try {
      revalidateTag('reading_list', 'max');
    } catch {
      // Ignore
    }
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
