import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateRequest,
} from '@/lib/api';
import { getDB } from '@/lib/cloudflare';

const analyticsSchema = z.object({
  path: z.string(),
  referrer: z.string().optional(),
  user_agent: z.string().optional(),
  country: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, analyticsSchema);
    if ('error' in validation) return validation.error;

    const data = validation.data;

    const db = getDB();
    if (!db) return apiError('Database not available', 500);

    const user_agent = data.user_agent || 'Unknown';
    const is_bot = /bot|crawler|spider|crawling/i.test(user_agent) ? 1 : 0;

    await db
      .prepare(
        'INSERT INTO analytics_events (id, path, country, referrer, user_agent, is_bot) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .bind(
        crypto.randomUUID(),
        data.path,
        data.country || 'Unknown',
        data.referrer || 'Direct',
        user_agent,
        is_bot,
      )
      .run();

    return apiSuccess({ recorded: true });
  } catch (error) {
    return handleApiError(error);
  }
}
