import { NextRequest, NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 300 },
      },
    );

    if (!spotifyRes.ok) {
      return NextResponse.json(
        { error: 'Spotify error' },
        { status: spotifyRes.status },
      );
    }

    const data = (await spotifyRes.json()) as {
      items: Array<{ track: SpotifyTrack; played_at: string }>;
    };
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
