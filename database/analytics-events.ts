'use server';

import { getDB } from '@/lib/cloudflare';
import { AnalyticsEvent } from '@/types/analytics-event';

interface AnalyticsRow {
  id: string;
  path: string;
  country: string;
  referrer: string;
  user_agent: string;
  is_bot: number;
  created_at: number;
}

export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  try {
    const db = getDB();
    if (!db) return [];
    const { results } = await db
      .prepare('SELECT * FROM analyticsEvents ORDER BY created_at DESC')
      .all<AnalyticsRow>();
    return results.map((row) => ({
      id: row.id,
      path: row.path,
      country: row.country,
      referrer: row.referrer,
      user_agent: row.user_agent,
      is_bot: !!row.is_bot,
      created: new Date(row.created_at * 1000).toISOString(),
    }));
  } catch {
    return [];
  }
}
