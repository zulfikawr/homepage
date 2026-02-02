'use server';

import { revalidatePath } from 'next/cache';

import { getDB } from '@/lib/cloudflare';

interface FeedbackRow {
  id: string;
  feedback: string;
  contact: string;
  created_at: number;
}

export async function getFeedback() {
  try {
    const db = getDB();
    const { results } = await db
      .prepare('SELECT * FROM feedback ORDER BY created_at DESC')
      .all<FeedbackRow>();
    return results;
  } catch {
    return [];
  }
}

export async function deleteFeedback(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    await db.prepare('DELETE FROM feedback WHERE id = ?').bind(id).run();
    revalidatePath('/database/feedback');
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function createFeedback(data: {
  feedback: string;
  contact: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDB();
    await db
      .prepare('INSERT INTO feedback (id, feedback, contact) VALUES (?, ?, ?)')
      .bind(crypto.randomUUID(), data.feedback, data.contact)
      .run();
    revalidatePath('/database/feedback');
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
