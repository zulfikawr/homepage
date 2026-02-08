'use server';

import { revalidatePath } from 'next/cache';

import { executeQuery, executeUpdate, handleDatabaseError } from './base';

interface FeedbackRow {
  id: string;
  feedback: string;
  contact: string;
  created_at: number;
}

export async function getFeedbacks(): Promise<FeedbackRow[]> {
  try {
    return await executeQuery<FeedbackRow>(
      'SELECT * FROM feedback ORDER BY created_at DESC',
    );
  } catch (error) {
    handleDatabaseError(error, 'get feedbacks');
  }
}

export async function createFeedback(data: {
  feedback: string;
  contact: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await executeUpdate(
      'INSERT INTO feedback (id, feedback, contact) VALUES (?, ?, ?)',
      [crypto.randomUUID(), data.feedback, data.contact],
    );
    revalidatePath('/database/feedback');
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function deleteFeedback(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await executeUpdate('DELETE FROM feedback WHERE id = ?', [id]);
    revalidatePath('/database/feedback');
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
