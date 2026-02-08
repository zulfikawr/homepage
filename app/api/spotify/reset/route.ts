import { apiError, apiSuccess, handleApiError } from '@/lib/api';
import { getDB } from '@/lib/cloudflare';

export async function POST() {
  try {
    const db = getDB();
    if (!db) return apiError('Database not available', 500);

    await db
      .prepare('DELETE FROM spotifyTokens WHERE id = ?')
      .bind('spotify')
      .run();

    return apiSuccess({ reset: true });
  } catch (error) {
    return handleApiError(error);
  }
}
