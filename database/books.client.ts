import pb from '@/lib/pocketbase';
import { Book } from '@/types/book';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Book object.
 */
export function mapRecordToBook(record: RecordModel): Book {
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
