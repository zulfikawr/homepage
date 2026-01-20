'use server';

import pb from '@/lib/pocketbase';
import { Employment } from '@/types/employment';
import { RecordModel } from 'pocketbase';
import { revalidateTag } from 'next/cache';
import { mapRecordToEmployment } from './employments.client';

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
  try {
    const record = await pb.collection('employments').create<RecordModel>(data);
    const employment = mapRecordToEmployment(record);
    try {
      revalidateTag('employments', 'max');
    } catch {
      // Ignore
    }
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
  try {
    const { id, ...rest } = data;
    let recordId = id;

    if (recordId.length !== 15) {
      try {
        const record = await pb
          .collection('employments')
          .getFirstListItem(`slug="${recordId}"`);
        recordId = record.id;
      } catch {
        // Ignore
      }
    }

    const record = await pb
      .collection('employments')
      .update<RecordModel>(recordId, rest);
    const employment = mapRecordToEmployment(record);
    try {
      revalidateTag('employments', 'max');
    } catch {
      // Ignore
    }
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
  try {
    let recordId = id;
    if (id.length !== 15) {
      const record = await pb
        .collection('employments')
        .getFirstListItem(`slug="${id}"`);
      recordId = record.id;
    }
    await pb.collection('employments').delete(recordId);
    try {
      revalidateTag('employments', 'max');
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
