'use server';

import pb from '@/lib/pocketbase';
import { Section } from '@/types/section';
import { RecordModel } from 'pocketbase';
import { revalidateTag } from 'next/cache';
import { mapRecordToSection } from './sections.client';

/**
 * Fetches all sections from the database.
 */
export async function getSections(): Promise<Section[]> {
  'use cache';
  try {
    const records = await pb
      .collection('sections')
      .getFullList<RecordModel>({ sort: 'order' });
    return records.map(mapRecordToSection);
  } catch {
    return [];
  }
}

/**
 * Adds a new section to the database.
 */
export async function addSection(
  data: Omit<Section, 'id'>,
): Promise<{ success: boolean; section?: Section; error?: string }> {
  try {
    const record = await pb.collection('sections').create<RecordModel>(data);
    const section = mapRecordToSection(record);
    try {
      revalidateTag('sections', 'max');
    } catch {
      // Ignore
    }
    return { success: true, section };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Updates an existing section in the database.
 */
export async function updateSection(
  id: string,
  data: Partial<Section>,
): Promise<{ success: boolean; section?: Section; error?: string }> {
  try {
    const record = await pb
      .collection('sections')
      .update<RecordModel>(id, data);
    const section = mapRecordToSection(record);
    try {
      revalidateTag('sections', 'max');
    } catch {
      // Ignore
    }
    return { success: true, section };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Deletes a section from the database.
 */
export async function deleteSection(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await pb.collection('sections').delete(id);
    try {
      revalidateTag('sections', 'max');
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
