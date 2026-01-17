import pb from '@/lib/pocketbase';
import { RecordModel } from 'pocketbase';

export interface FeedbackEntry {
  id: string;
  feedback: string;
  contact: string;
  created: string;
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
  try {
    await pb.collection('feedback').delete(id);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
