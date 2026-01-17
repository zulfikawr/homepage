import pb from '@/lib/pocketbase';
import { Book } from '@/types/book';

/**
 * Fetches and subscribes to books data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function booksData(callback: (data: Book[]) => void) {
  const fetchAll = async () => {
    try {
      const data = await pb
        .collection('books')
        .getFullList<Book>({ sort: '-created' });
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAll();

  pb.collection('books').subscribe('*', fetchAll);

  return () => pb.collection('books').unsubscribe();
}

/**
 * Fetches all books from the database.
 * @returns Promise with array of books.
 */
export async function getBooks(): Promise<Book[]> {
  try {
    return await pb.collection('books').getFullList<Book>({ sort: '-created' });
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
    const record = await pb.collection('books').create<Book>(data);
    return { success: true, book: record };
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
    if (id.length !== 15) {
      const record = await pb
        .collection('books')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    const record = await pb.collection('books').update<Book>(recordId, rest);
    return { success: true, book: record };
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
        .collection('books')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('books').delete(recordId);
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
      return await pb.collection('books').getOne<Book>(id);
    }
    return await pb.collection('books').getFirstListItem<Book>(`slug="${id}"`);
  } catch {
    return null;
  }
}
