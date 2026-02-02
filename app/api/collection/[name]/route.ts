import { NextRequest, NextResponse } from 'next/server';

import { getDB } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> },
) {
  try {
    let { name } = await context.params;
    // Remove trailing slash if present
    name = name.replace(/\/$/, '');

    const db = getDB();
    if (!db)
      return NextResponse.json({ error: 'DB not available' }, { status: 500 });

    const tableMap: Record<string, string> = {
      profile: 'personal_info',
      reading_list: 'books',
      interests_and_objectives: 'interests_objectives',
    };

    const table = tableMap[name] || name;

    const whitelist = [
      'posts',
      'projects',
      'books',
      'certificates',
      'employments',
      'publications',
      'sections',
      'personal_info',
      'interests_objectives',
      'feedback',
      'comments',
      'resume',
      'analytics_events',
      'movies',
    ];

    if (!whitelist.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid collection' },
        { status: 400 },
      );
    }

    const { results } = await db.prepare(`SELECT * FROM ${table}`).all();

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Collection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
