'use server';

import pb from '@/lib/pocketbase';
import { PersonalInfo } from '@/types/personalInfo';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {
  COLLECTION,
  RECORD_ID,
  mapRecordToPersonalInfo,
} from './personalInfo.client';

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
 * Fetches the personal info from the database.
 * @returns Promise with personal info data.
 */
export async function getPersonalInfo(): Promise<PersonalInfo> {
  'use cache';
  try {
    const record = await pb.collection(COLLECTION).getOne(RECORD_ID);
    return mapRecordToPersonalInfo(record);
  } catch {
    return {
      name: 'Zulfikar',
      title: 'I build things for the web',
      avatarUrl: '/avatar.jpg',
    };
  }
}

/**
 * Updates the personal info data.
 * @param data New personal info data or FormData.
 * @returns Promise with operation result.
 */
export async function updatePersonalInfo(
  data: PersonalInfo | FormData,
): Promise<{ success: boolean; data?: PersonalInfo; error?: string }> {
  await ensureAuth();
  try {
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      updateData = data;
    } else {
      const cleanData: Record<string, unknown> = {
        name: data.name,
        title: data.title,
      };

      const finalAvatarUrl = data.avatarUrl;
      if (finalAvatarUrl && finalAvatarUrl.includes('/api/files/')) {
        const parts = finalAvatarUrl.split('/');
        const fileName = parts[parts.length - 1].split('?')[0];
        cleanData.avatar = fileName;
        cleanData.avatarUrl = '';
      } else {
        cleanData.avatarUrl = finalAvatarUrl;
      }
      updateData = cleanData;
    }

    const record = await pb
      .collection(COLLECTION)
      .update(RECORD_ID, updateData);

    revalidatePath('/');
    revalidatePath('/database/personal-info');
    revalidateTag('profile', 'max');

    return { success: true, data: mapRecordToPersonalInfo(record) };
  } catch {
    // Try to create if it doesn't exist
    try {
      const record = await pb
        .collection(COLLECTION)
        .create({ id: RECORD_ID, ...data });

      revalidatePath('/');
      revalidatePath('/database/personal-info');
      revalidateTag('profile', 'max');

      return { success: true, data: mapRecordToPersonalInfo(record) };
    } catch (createError: unknown) {
      return {
        success: false,
        error:
          createError instanceof Error
            ? createError.message
            : String(createError),
      };
    }
  }
}
