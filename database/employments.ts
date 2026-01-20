'use server';

import pb from '@/lib/pocketbase';
import { Employment } from '@/types/employment';
import { RecordModel } from 'pocketbase';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { mapRecordToEmployment } from './employments.client';

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
 * Fetches all employment records.
 * @returns Promise with array of employments.
 */
export async function getEmployments(): Promise<Employment[]> {
  'use cache';
  try {
    const records = await pb
      .collection('employments')
      .getFullList<RecordModel>({ sort: '-created' });
    return records.map(mapRecordToEmployment);
  } catch {
    return [];
  }
}

/**
 * Adds a new employment record.
 * @param data Employment data without ID.
 * @returns Promise with operation result.
 */
export async function addEmployment(
  data: Omit<Employment, 'id'>,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  await ensureAuth();
  try {
    const record = await pb.collection('employments').create<RecordModel>(data);
    const employment = mapRecordToEmployment(record);

    revalidatePath('/employments');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true, employment };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing employment record.
 * @param data Updated employment data.
 * @returns Promise with operation result.
 */
export async function updateEmployment(
  data: Employment,
): Promise<{ success: boolean; employment?: Employment; error?: string }> {
  await ensureAuth();
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      const records = await pb
        .collection('employments')
        .getFullList<RecordModel>({
          filter: `slug = "${recordId}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('employments').getOne(recordId);
      } catch (_) {
        const records = await pb
          .collection('employments')
          .getFullList<RecordModel>({
            filter: `slug = "${recordId}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }

    const record = await pb
      .collection('employments')
      .update<RecordModel>(recordId, rest);
    const employment = mapRecordToEmployment(record);

    revalidatePath('/employments');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true, employment };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes an employment record.
 * @param id ID or slug of the record.
 * @returns Promise with operation result.
 */
export async function deleteEmployment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  await ensureAuth();
  try {
    let recordId = id;
    if (id.length !== 15) {
      const records = await pb
        .collection('employments')
        .getFullList<RecordModel>({
          filter: `slug = "${id}"`,
        });
      if (records.length > 0) recordId = records[0].id;
    } else {
      try {
        await pb.collection('employments').getOne(id);
      } catch (_) {
        const records = await pb
          .collection('employments')
          .getFullList<RecordModel>({
            filter: `slug = "${id}"`,
          });
        if (records.length > 0) recordId = records[0].id;
      }
    }
    await pb.collection('employments').delete(recordId);

    revalidatePath('/employments');
    revalidatePath('/database/employments');
    revalidateTag('employments', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetches a single employment record by ID or slug.
 * @param id ID or slug of the record.
 * @returns Promise with the record or null.
 */
export async function getEmploymentById(
  id: string,
): Promise<Employment | null> {
  'use cache';
  try {
    if (id.length === 15) {
      try {
        const record = await pb
          .collection('employments')
          .getOne<RecordModel>(id);
        if (record) return mapRecordToEmployment(record);
      } catch {
        // Ignored
      }
    }

    const records = await pb
      .collection('employments')
      .getFullList<RecordModel>({
        filter: `slug = "${id}"`,
        requestKey: null,
      });

    if (records.length > 0) {
      return mapRecordToEmployment(records[0]);
    }

    return null;
  } catch {
    return null;
  }
}
