import pb from '@/lib/pocketbase';
import { Publication } from '@/types/publication';
import { RecordModel } from 'pocketbase';

/**
 * Maps a PocketBase record to a Publication object.
 */
function mapRecordToPublication(record: RecordModel): Publication {
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
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
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

/**
 * Fetches all publications from the database.
 * @returns Promise with array of publications.
 */
export async function getPublications(): Promise<Publication[]> {
  try {
    const records = await pb
      .collection('publications')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToPublication);
  } catch {
    return [];
  }
}

/**
 * Adds a new publication to the database.
 * @param data Publication data without ID.
 * @returns Promise with operation result.
 */
export async function addPublication(
  data: Omit<Publication, 'id'>,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  try {
    const record = await pb
      .collection('publications')
      .create<RecordModel>(data);
    return { success: true, publication: mapRecordToPublication(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing publication in the database.
 * @param data Updated publication data.
 * @returns Promise with operation result.
 */
export async function updatePublication(
  data: Publication,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      try {
        const record = await pb
          .collection('publications')
          .getFirstListItem(`slug="${recordId}"`);
        recordId = record.id;
      } catch {
        // Ignore
      }
    }

    const record = await pb
      .collection('publications')
      .update<RecordModel>(recordId, rest);
    return { success: true, publication: mapRecordToPublication(record) };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a publication from the database.
 * @param id ID or slug of the publication.
 * @returns Promise with operation result.
 */
export async function deletePublication(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('publications')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('publications').delete(recordId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single publication by ID or slug.
 * @param id ID or slug of the publication.
 * @returns Promise with the publication data or null.
 */
export async function getPublicationById(
  id: string,
): Promise<Publication | null> {
  try {
    if (id.length === 15) {
      try {
        const record = await pb
          .collection('publications')
          .getOne<RecordModel>(id);
        if (record) return mapRecordToPublication(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb
      .collection('publications')
      .getFullList<RecordModel>({
        filter: `slug = "${id}"`,
        requestKey: null,
      });

    if (records.length > 0) {
      return mapRecordToPublication(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
