import { NextRequest } from 'next/server';
import { z } from 'zod';

import { apiSuccess, handleApiError, validateRequest } from '@/lib/api';
import { saveSpotifyTokens } from '@/lib/spotify';

const callbackSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const validation = await validateRequest(request, callbackSchema);
    if ('error' in validation) return validation.error;

    const { accessToken, refreshToken } = validation.data;

    await saveSpotifyTokens(accessToken, refreshToken);

    return apiSuccess({ saved: true });
  } catch (error) {
    return handleApiError(error);
  }
}
