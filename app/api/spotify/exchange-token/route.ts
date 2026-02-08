import { NextRequest } from 'next/server';
import { z } from 'zod';

import {
  apiError,
  apiSuccess,
  handleApiError,
  validateRequest,
} from '@/lib/api';
import { saveSpotifyTokens } from '@/lib/spotify';

const exchangeSchema = z.object({
  code: z.string().min(1),
});

interface SpotifyTokenResponse {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, exchangeSchema);
    if ('error' in validation) return validation.error;

    const { code } = validation.data;

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const redirectUri = `${baseUrl}/callback`;

    if (!clientId || !clientSecret) {
      return apiError('Spotify credentials not configured', 500);
    }

    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      },
    );

    const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;

    if (tokenData.error) {
      return apiError(
        tokenData.error_description || tokenData.error,
        tokenResponse.status,
      );
    }

    if (tokenData.access_token && tokenData.refresh_token) {
      await saveSpotifyTokens(tokenData.access_token, tokenData.refresh_token);
    } else {
      return apiError('Missing tokens in Spotify response', 500);
    }

    return apiSuccess({ exchanged: true });
  } catch (error) {
    return handleApiError(error);
  }
}
