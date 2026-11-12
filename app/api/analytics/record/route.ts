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

    // Bots are excluded from the summary anyway; skipping them saves writes.
    if (is_bot) return apiSuccess({ recorded: false, bot: true });

    const country = data.country || 'Unknown';
    let referrer = data.referrer || 'Direct';
    if (referrer !== 'Direct' && referrer.startsWith('http')) {
      try {
        referrer = new URL(referrer).hostname;
      } catch {
        // Keep the original value if it is not a valid URL.
      }
    }

    const device = /mobile|android|iphone|ipad/i.test(user_agent)
      ? 'Mobile'
      : 'Desktop';
    const day = new Date().toISOString().slice(0, 10);
    const visitor = `${user_agent}||${country}`;

    await db
      .prepare(
        'INSERT INTO analytics_events (id, path, country, referrer, user_agent, is_bot) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .bind(
        crypto.randomUUID(),
        data.path,
        country,
        referrer,
        user_agent,
        is_bot,
      )
      .run();

    await db
      .prepare(
        `INSERT INTO analytics_daily (day, path, country, referrer, device, views)
         VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(day, path, country, referrer, device)
         DO UPDATE SET views = views + 1`,
      )
      .bind(day, data.path, country, referrer, device)
      .run();

    await db
      .prepare('INSERT OR IGNORE INTO analytics_visitors (visitor) VALUES (?)')
      .bind(visitor)
      .run();

    return apiSuccess({ recorded: true });
  } catch (error) {
    return handleApiError(error);
  }
}
