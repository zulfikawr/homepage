import type { NextApiRequest, NextApiResponse } from 'next';
import { database, ref, get, set, remove } from '~/lib/firebase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Handle GET requests (fetch books)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const readingListRef = ref(database, 'reading-list');
    const snapshot = await get(readingListRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const books = Object.entries(data).map(([id, book]: [string, any]) => ({
        id,
        ...book,
      }));

      return res.status(200).json({ books });
    } else {
      return res.status(200).json({ books: [] });
    }
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return res.status(500).json({ error: 'Failed to fetch reading list' });
  }
}

// Handle POST requests (add a new book)
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, author, imageURL, link, type } = req.body;

    if (!title || !author || !link || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBook = {
      id: Date.now().toString(),
      type,
      title,
      author,
      imageURL: imageURL || '/images/books/default.jpg',
      link,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const newBookRef = ref(database, `reading-list/${newBook.id}`);
    await set(newBookRef, newBook);

    return res
      .status(201)
      .json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    return res.status(500).json({ error: 'Failed to add book' });
  }
}

// Handle PUT requests (edit a book)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, title, author, imageURL, link, type } = req.body;

    if (!id || !title || !author || !link || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedBook = {
      id,
      type,
      title,
      author,
      imageURL: imageURL || '/images/books/default.jpg',
      link,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    const bookRef = ref(database, `reading-list/${id}`);
    await set(bookRef, updatedBook);

    return res
      .status(200)
      .json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ error: 'Failed to update book' });
  }
}

// Handle DELETE requests (delete a book)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const bookRef = ref(database, `reading-list/${id}`);
    await remove(bookRef);

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ error: 'Failed to delete book' });
  }
}
