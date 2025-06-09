import { generateId } from '@/utilities/generateId';
import { database, ref, get, set, remove, onValue } from '@/lib/firebase';
import { Book } from '@/types/book';

/**
 * Subscribe to books changes in Firebase
 * @param callback Function to call when data changes
 * @returns Unsubscribe function
 */
export function booksData(callback: (data: Book[]) => void) {
  const readingListRef = ref(database, 'reading-list');

  return onValue(readingListRef, (snapshot) => {
    const data = snapshot.exists()
      ? Object.entries(snapshot.val()).map(
          ([id, book]: [string, Omit<Book, 'id'>]) => ({
            id,
            ...book,
          }),
        )
      : [];
    callback(data);
  });
}

/**
 * Fetch all books from Firebase
 * @returns Promise with array of books
 */
export async function getBooks(): Promise<Book[]> {
  try {
    const readingListRef = ref(database, 'reading-list');
    const snapshot = await get(readingListRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const books = Object.entries(data).map(
        ([id, book]: [string, Omit<Book, 'id'>]) => ({
          id,
          ...book,
        }),
      );
      return books;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books');
  }
}

/**
 * Add a new book to Firebase
 * @param data Book data to add
 * @returns Promise with operation result
 */
export async function addBook(
  data: Omit<Book, 'id'>,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  try {
    const { title, author, imageURL, link, type, dateAdded } = data;

    if (!title || !author || !link || !type || !dateAdded) {
      return { success: false, error: 'Missing required fields' };
    }

    const newBook: Book = {
      id: generateId(title),
      type,
      title,
      author,
      imageURL,
      link,
      dateAdded,
    };

    const newBookRef = ref(database, `reading-list/${newBook.id}`);
    await set(newBookRef, newBook);

    return { success: true, book: newBook };
  } catch (error) {
    console.error('Error adding book:', error);
    return { success: false, error: 'Failed to add book' };
  }
}

/**
 * Update an existing book in Firebase
 * @param data Updated book data
 * @returns Promise with operation result
 */
export async function updateBook(
  data: Book,
): Promise<{ success: boolean; book?: Book; error?: string }> {
  try {
    const { id, title, author, imageURL, link, type, dateAdded } = data;

    if (!id || !title || !author || !link || !type || !dateAdded) {
      return { success: false, error: 'Missing required fields' };
    }

    const updatedBook: Book = {
      id,
      type,
      title,
      author,
      imageURL,
      link,
      dateAdded,
    };

    const bookRef = ref(database, `reading-list/${id}`);
    await set(bookRef, updatedBook);

    return { success: true, book: updatedBook };
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: false, error: 'Failed to update book' };
  }
}

/**
 * Delete a book from Firebase
 * @param id ID of the book to delete
 * @returns Promise with operation result
 */
export async function deleteBook(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) {
      return { success: false, error: 'Book ID is required' };
    }

    const bookRef = ref(database, `reading-list/${id}`);
    await remove(bookRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting book:', error);
    return { success: false, error: 'Failed to delete book' };
  }
}

/**
 * Get a single book by ID from Firebase
 * @param id ID of the book to fetch
 * @returns Promise with the book or null if not found
 */
export async function getBookById(id: string): Promise<Book | null> {
  try {
    if (!id) throw new Error('Book ID is required');

    const bookRef = ref(database, `reading-list/${id}`);
    const snapshot = await get(bookRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    return { id, ...data };
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    return null;
  }
}
