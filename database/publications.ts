'use server';

import pb from '@/lib/pocketbase';
import { Publication } from '@/types/publication';
import { RecordModel } from 'pocketbase';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { mapRecordToPublication } from '@/lib/mappers';

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
 * Fetches all publications from the database.
 */
export async function getPublications(): Promise<Publication[]> {
  'use cache';
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
 */
export async function addPublication(
  data: Omit<Publication, 'id'>,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  await ensureAuth();
  try {
    const record = await pb
      .collection('publications')
      .create<RecordModel>(data);
    const publication = mapRecordToPublication(record);

    revalidatePath('/publications');
    revalidatePath('/database/publications');
    revalidateTag('publications', 'max');

    return { success: true, publication };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing publication in the database.
 */
export async function updatePublication(
  data: Publication,
): Promise<{ success: boolean; publication?: Publication; error?: string }> {
  await ensureAuth();
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      const records = await pb
        .collection('publications')
        .getFullList<RecordModel>({
          filter: `slug = "${recordId}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('publications').getOne(recordId);
      } catch {
        const records = await pb
          .collection('publications')
          .getFullList<RecordModel>({
            filter: `slug = "${recordId}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }

    const record = await pb
      .collection('publications')
      .update<RecordModel>(recordId, rest);
    const publication = mapRecordToPublication(record);

    revalidatePath('/publications');
    revalidatePath('/database/publications');
    revalidateTag('publications', 'max');

    return { success: true, publication };
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
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb
        .collection('publications')
        .getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('publications').getOne(id);
      } catch {
        const records = await pb
          .collection('publications')
          .getFullList<RecordModel>({
            filter: `slug = "${id}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('publications').delete(recordId);

    revalidatePath('/publications');
    revalidatePath('/database/publications');
    revalidateTag('publications', 'max');

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
 */
export async function getPublicationById(
  id: string,
): Promise<Publication | null> {
  'use cache';
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
