import { NextRequest, NextResponse } from 'next/server';

import { saveSpotifyTokens } from '@/lib/spotify';

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = (await request.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing access token or refresh token' },
        { status: 400 },
      );
    }

    await saveSpotifyTokens(accessToken, refreshToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save Spotify tokens:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
