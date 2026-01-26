'use server';

import { cookies } from 'next/headers';

import pb from '@/lib/pocketbase';
import { AnalyticsEvent } from '@/types/analytics';

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
 * Fetches analytics events. Note: Subscriptions should be handled by client hooks.
 * This server-side function provides the initial list.
 */
export async function getAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  await ensureAuth();
  try {
    const records = await pb.collection('analytics_events').getFullList({
      sort: '-created',
    });
    return records as unknown as AnalyticsEvent[];
  } catch {
    return [];
  }
}
