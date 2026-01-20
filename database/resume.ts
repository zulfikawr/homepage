'use server';

import pb from '@/lib/pocketbase';
import { Resume } from '@/types/resume';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { mapRecordToResume } from '@/lib/mappers';

const COLLECTION = 'resume';
const RECORD_ID = 'resumemainrec00';

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
 * Fetches the resume info from the database.
 * @returns Promise with resume data.
 */
export async function getResume(): Promise<Resume> {
  try {
    const record = await pb.collection(COLLECTION).getOne(RECORD_ID);
    return mapRecordToResume(record);
  } catch {
    return {
      fileUrl: '',
    };
  }
}

/**
 * Updates the resume data.
 * @param data New resume data or FormData.
 * @returns Promise with operation result.
 */
export async function updateResume(
  data: Resume | FormData,
): Promise<{ success: boolean; data?: Resume; error?: string }> {
  await ensureAuth();
  try {
    let updateData: Record<string, unknown> | FormData;

    if (data instanceof FormData) {
      updateData = data;
    } else {
      updateData = {
        fileUrl: data.fileUrl,
      };
    }

    const record = await pb
      .collection(COLLECTION)
      .update(RECORD_ID, updateData);

    revalidatePath('/database/resume');
    revalidatePath('/contacts'); // Assuming resume might be linked here

    return { success: true, data: mapRecordToResume(record) };
  } catch {
    // Try to create if it doesn't exist
    try {
      let record;
      if (data instanceof FormData) {
        data.append('id', RECORD_ID);
        record = await pb.collection(COLLECTION).create(data);
      } else {
        const createData: Record<string, unknown> = {
          id: RECORD_ID,
          file: data.fileUrl,
        };
        record = await pb.collection(COLLECTION).create(createData);
      }

      revalidatePath('/database/resume');

      return { success: true, data: mapRecordToResume(record) };
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
