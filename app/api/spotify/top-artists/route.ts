import { NextRequest, NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/spotify';
import { SpotifyArtist } from '@/types/spotify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const timeRange = searchParams.get('timeRange') || 'short_term';
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/top/artists?limit=${limit}&timeRange=${timeRange}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 3600 },
      },
    );

    if (!spotifyRes.ok) {
      return NextResponse.json(
        { error: 'Spotify error' },
        { status: spotifyRes.status },
      );
    }

    const data = (await spotifyRes.json()) as { items: SpotifyArtist[] };
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
