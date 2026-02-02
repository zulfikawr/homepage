import { NextRequest, NextResponse } from 'next/server';

import { getDB } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as {
      path: string;
      referrer: string;
      userAgent: string;
      country: string;
    };

    const db = getDB();
    if (!db) {
      return NextResponse.json({ error: 'DB not available' }, { status: 500 });
    }

    const isBot = /bot|crawler|spider|crawling/i.test(data.userAgent || '')
      ? 1
      : 0;

    await db
      .prepare(
        'INSERT INTO analytics_events (id, path, country, referrer, user_agent, is_bot) VALUES (?, ?, ?, ?, ?, ?)',
      )
      .bind(
        crypto.randomUUID(),
        data.path,
        data.country || 'Unknown',
        data.referrer || 'Direct',
        data.userAgent || 'Unknown',
        isBot,
      )
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
