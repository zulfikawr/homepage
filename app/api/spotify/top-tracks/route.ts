import { NextRequest, NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const time_range = searchParams.get('time_range') || 'short_term';
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${time_range}`,
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

    const data = (await spotifyRes.json()) as { items: SpotifyTrack[] };
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
