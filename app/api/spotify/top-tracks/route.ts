import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateSearchParams,
} from '@/lib/api';
import { getAccessToken } from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';

const querySchema = z.object({
  limit: z.string().optional().default('10'),
  timeRange: z.string().optional().default('short_term'),
});

export async function GET(request: NextRequest) {
  try {
    const validation = await validateSearchParams(request, querySchema);
    if ('error' in validation) return validation.error;

    const { limit, timeRange } = validation.data;
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&timeRange=${timeRange}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 300 },
      },
    );

    if (!spotifyRes.ok) {
      return apiError('Spotify error', spotifyRes.status);
    }

    const data = (await spotifyRes.json()) as { items: SpotifyTrack[] };
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
