import pb from '@/lib/pocketbase';
import { Publication } from '@/types/publication';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Publication object.
 */
export function mapRecordToPublication(record: RecordModel): Publication {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    publisher: record.publisher,
    link: record.link,
    openAccess: record.openAccess,
    excerpt: record.excerpt,
    authors:
      typeof record.authors === 'string'
        ? JSON.parse(record.authors)
        : record.authors,
    keywords:
      typeof record.keywords === 'string'
        ? JSON.parse(record.keywords)
        : record.keywords,
  };
}

/**
 * Fetches and subscribes to publications data.
 */
export function publicationsData(callback: (data: Publication[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('publications')
        .getFullList<RecordModel>({ sort: '-created' });
      callback(records.map(mapRecordToPublication));
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('publications').subscribe('*', fetchAndCallback);
  return () => pb.collection('publications').unsubscribe();
}
