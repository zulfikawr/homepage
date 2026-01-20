'use server';

import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export interface FeedbackEntry {
  id: string;
  feedback: string;
  contact: string;
  created: string;
}

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
 * Fetches and subscribes to feedback data.
 * @param callback Function to call when data changes.
 * @returns Unsubscribe function.
 */
export function feedbackData(callback: (data: FeedbackEntry[]) => void) {
  const fetchAndCallback = async () => {
    try {
      const records = await pb
        .collection('feedback')
        .getFullList<RecordModel>({ sort: '-created' });
      const data: FeedbackEntry[] = records.map((record) => ({
        id: record.id,
        feedback: record.feedback,
        contact: record.contact,
        created: record.created,
      }));
      callback(data);
    } catch {
      callback([]);
    }
  };

  fetchAndCallback();
  pb.collection('feedback').subscribe('*', fetchAndCallback);
  return () => pb.collection('feedback').unsubscribe();
}

/**
 * Deletes a feedback entry.
 * @param id ID of the feedback entry.
 * @returns Promise with operation result.
 */
export async function deleteFeedback(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  await ensureAuth();
  try {
    await pb.collection('feedback').delete(id);

    revalidatePath('/database/feedback');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
