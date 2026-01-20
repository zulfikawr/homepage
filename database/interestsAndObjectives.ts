'use server';

import pb from '@/lib/pocketbase';
import { InterestsAndObjectives } from '@/types/interestsAndObjectives';
import { RecordModel } from 'pocketbase';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {
  COLLECTION,
  mapInterestsRecord,
  defaultInterestsData,
} from './interestsAndObjectives.client';

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
 * Fetches all interests and objectives from the database and picks a random one.
 * @returns Promise with interests and objectives data.
 */
export async function getInterestsAndObjectives(): Promise<InterestsAndObjectives> {
  'use cache';
  try {
    const records = await pb.collection(COLLECTION).getFullList<RecordModel>();

    if (records.length > 0) {
      const randomRecord = records[Math.floor(Math.random() * records.length)];
      return mapInterestsRecord(randomRecord);
    }
    return defaultInterestsData;
  } catch {
    return defaultInterestsData;
  }
}

/**
 * Updates an interests and objectives record.
 */
export async function updateInterestsAndObjectives(
  data: InterestsAndObjectives & { id?: string },
): Promise<{
  success: boolean;
  data?: InterestsAndObjectives;
  error?: string;
}> {
  await ensureAuth();
  try {
    const id = data.id || 'main';
    const updateData: Record<string, unknown> = { ...data };
    if ('id' in updateData) delete updateData.id;

    let record;
    try {
      record = await pb
        .collection(COLLECTION)
        .update<RecordModel>(id, updateData);
    } catch {
      record = await pb.collection(COLLECTION).create({ id, ...updateData });
    }

    revalidatePath('/');
    revalidatePath('/database/interests-and-objectives');
    revalidateTag('interests_and_objectives', 'max');

    return {
      success: true,
      data: mapInterestsRecord(record as unknown as RecordModel),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
