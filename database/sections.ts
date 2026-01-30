'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { RecordModel } from 'pocketbase';

import { mapRecordToSection } from '@/lib/mappers';
import pb from '@/lib/pocketbase';
import { Section } from '@/types/section';

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
 * Fetches all sections from the database.
 */
export async function getSections(): Promise<Section[]> {
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
  await ensureAuth();
  try {
    const record = await pb.collection('sections').create<RecordModel>(data);
    const section = mapRecordToSection(record);

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('sections', 'max');

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
  await ensureAuth();
  try {
    const record = await pb
      .collection('sections')
      .update<RecordModel>(id, data);
    const section = mapRecordToSection(record);

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('sections', 'max');

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
  await ensureAuth();
  try {
    await pb.collection('sections').delete(id);

    revalidatePath('/');
    revalidatePath('/database/sections');
    revalidateTag('sections', 'max');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
