'use server';

import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getFileUrl } from '@/lib/storage';

/**
 * Ensures the PocketBase client is authenticated for server-side operations.
 */
async function ensureAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('pb_auth');

  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }
}

/**
 * Uploads a file to a specific collection and record.
 *
 * @param collectionName - Target collection name
 * @param recordId - Target record ID
 * @param fieldName - Field name for the file
 * @param formData - FormData containing the file
 * @returns Result object with success status and full URL
 */
export async function uploadFile(
  collectionName: string,
  recordId: string,
  fieldName: string,
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  await ensureAuth();
  try {
    const record = await pb
      .collection(collectionName)
      .update<RecordModel>(recordId, formData);

    const fileName = record[fieldName] as string;
    if (!fileName) {
      return {
        success: false,
        error: 'Upload succeeded but no filename returned',
      };
    }

    const url = getFileUrl(record, fileName);

    // Revalidate paths that might be affected
    revalidatePath('/database');
    revalidatePath(`/database/${collectionName}`);

    return { success: true, url };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
