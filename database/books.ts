import pb from '@/lib/pocketbase';
import { Book } from '@/types/book';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Book object.
 */
function mapRecordToBook(record: RecordModel): Book {
  return {
    id: record.id,
    slug: record.slug,
    type: record.type,
    title: record.title,
    author: record.author,
    imageURL: record.imageURL,
    link: record.link,
    dateAdded: record.dateAdded,
  };
}

/**
 * Fetches and subscribes to books data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function booksData(callback: (data: Book[]) => void) {
  const fetchAll = async () => {
    try {
      const records = await pb
        .collection('reading_list')
        .getFullList<RecordModel>({ sort: '-created' });
      callback(records.map(mapRecordToBook));
    } catch {
      callback([]);
    }
  };

  fetchAll();

  pb.collection('reading_list').subscribe('*', fetchAll);

  return () => pb.collection('reading_list').unsubscribe();
}

/**
 * Fetches all books from the database.
 * @returns Promise with array of books.
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
 * @param data Book data without ID.
 * @returns Promise with operation result.
 */
export async function addBook(
  data: Omit<Book, 'id'>,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  try {
    const record = await pb
      .collection('reading_list')
      .create<RecordModel>(data);
    return { success: true, book: mapRecordToBook(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing book in the database.
 * @param data Updated book data.
 * @returns Promise with operation result.
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
    return { success: true, book: mapRecordToBook(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a book from the database.
 * @param id ID or slug of the book.
 * @returns Promise with operation result.
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
 * @param id ID or slug of the book.
 * @returns Promise with the book data or null.
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
