import { NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

export async function POST() {
  try {
    const adminEmail = process.env.PB_ADMIN_EMAIL;
    const adminPass = process.env.PB_ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
      return NextResponse.json(
        { error: 'Admin credentials not configured' },
        { status: 500 },
      );
    }

    const adminPb = new PocketBase(
      process.env.NEXT_PUBLIC_POCKETBASE_URL ||
        'https://pocketbase.zulfikar.site',
    );
    await adminPb
      .collection('_superusers')
      .authWithPassword(adminEmail, adminPass);

    await adminPb.collection('spotify_tokens').delete('spotify');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset Spotify tokens:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
