import { NextResponse } from 'next/server';

import { getAccessToken } from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 60 },
      },
    );

    if (spotifyRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    if (!spotifyRes.ok) {
      return NextResponse.json(
        { error: 'Spotify API error' },
        { status: spotifyRes.status },
      );
    }

    const trackData = (await spotifyRes.json()) as {
      is_playing: boolean;
      item: SpotifyTrack | null;
    };
    return NextResponse.json(trackData);
  } catch (error: unknown) {
    console.error('API Spotify Error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
