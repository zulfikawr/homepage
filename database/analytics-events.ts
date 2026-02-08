'use server';

import { AnalyticsEvent } from '@/types/analytics-event';

import { executeQuery, handleDatabaseError } from './base';

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
    const results = await executeQuery<AnalyticsRow>(
      'SELECT * FROM analyticsEvents ORDER BY created_at DESC',
    );
    return results.map((row) => ({
      id: row.id,
      path: row.path,
      country: row.country,
      referrer: row.referrer,
      user_agent: row.user_agent,
      is_bot: !!row.is_bot,
      created: new Date(row.created_at * 1000).toISOString(),
    }));
  } catch (error) {
    handleDatabaseError(error, 'get analytics events');
  }
}
