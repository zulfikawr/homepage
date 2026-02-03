import { NextRequest, NextResponse } from 'next/server';

import { getDB } from '@/lib/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as {
      path: string;
      referrer: string;
      user_agent: string;
      country: string;
    };

    const db = getDB();
    if (!db) {
      return NextResponse.json({ error: 'DB not available' }, { status: 500 });
    }

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
