import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateSearchParams,
} from '@/lib/api';
import { getAccessToken } from '@/lib/spotify';
import { SpotifyRecentlyPlayed } from '@/types/spotify';

const querySchema = z.object({
  limit: z.string().optional().default('10'),
});

export async function GET(request: NextRequest) {
  try {
    const validation = await validateSearchParams(request, querySchema);
    if ('error' in validation) return validation.error;

    const { limit } = validation.data;
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      },
    );

    if (!spotifyRes.ok) {
      return apiError('Spotify error', spotifyRes.status);
    }

    const data = (await spotifyRes.json()) as SpotifyRecentlyPlayed;
    const items = data.items.map((item) => ({
      track: item.track,
      playedAt: item.played_at,
    }));

    return apiSuccess({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
