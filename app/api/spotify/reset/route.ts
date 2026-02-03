import { NextResponse } from 'next/server';

import { getDB } from '@/lib/cloudflare';

export async function POST() {
  try {
    const db = getDB();
    if (!db) throw new Error('DB not available');

    await db
      .prepare('DELETE FROM spotifyTokens WHERE id = ?')
      .bind('spotify')
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset Spotify tokens:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
