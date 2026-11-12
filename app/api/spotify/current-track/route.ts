import { apiError, apiSuccess } from '@/lib/api';
import { getAccessToken } from '@/lib/spotify';
import { SpotifyCurrentlyPlaying } from '@/types/spotify';

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const spotifyRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (spotifyRes.status === 204) {
      return apiSuccess(null);
    }

    if (!spotifyRes.ok) {
      if (spotifyRes.status === 401 || spotifyRes.status === 403) {
        return apiSuccess(null);
      }
      return apiError('Spotify API error', spotifyRes.status);
    }

    const trackData = (await spotifyRes.json()) as SpotifyCurrentlyPlaying;
    return apiSuccess({
      isPlaying: trackData.is_playing,
      item: trackData.item,
    });
  } catch {
    // No token / expired token: the banner falls back to its static track.
    return apiSuccess(null);
  }
}
