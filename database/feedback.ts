'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import pb from '@/lib/pocketbase';

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

/**
 * Creates a new feedback entry.
 * @param data Feedback data.
 * @returns Promise with operation result.
 */
export async function createFeedback(data: {
  feedback: string;
  contact: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await pb.collection('feedback').create({
      ...data,
      timestamp: new Date().toISOString(),
    });

    revalidatePath('/database/feedback');

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
