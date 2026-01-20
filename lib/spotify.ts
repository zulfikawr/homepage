import pb from './pocketbase';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-top-read',
].join(' ');

export const getSpotifyAuthUrl = () => {
  // Use the current origin dynamically to avoid cached 'localhost' from ENV
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://dev.zulfikar.site';
  const redirectUri = `${origin}/callback/`;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

export const saveSpotifyTokens = async (
  accessToken: string,
  refreshToken: string,
) => {
  return await pb.collection('spotify_tokens').update('spotify', {
    access_token: accessToken,
    refresh_token: refreshToken,
    timestamp: Date.now(),
  });
};

export const getAccessToken = async () => {
  try {
    const tokens = await pb
      .collection('spotify_tokens')
      .getOne('spotify', { requestKey: null });

    if (!tokens) {
      throw new Error('No tokens found');
    }

    // Check if token is expired (1 hour)
    const isExpired = Date.now() - tokens.timestamp > 3600000;

    if (isExpired && tokens.refresh_token) {
      // Refresh token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: tokens.refresh_token,
        }),
      });

      const data = await response.json();

      // Update token in PocketBase
      await pb.collection('spotify_tokens').update('spotify', {
        access_token: data.access_token,
        refresh_token: tokens.refresh_token,
        timestamp: Date.now(),
      });

      return data.access_token;
    }

    return tokens.access_token;
  } catch {
    return null;
  }
};

export const getCurrentTrack = async () => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export const getRecentlyPlayed = async (limit = 10) => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch recent tracks');
  }

  return response.json();
};

export const getTopTracks = async (
  timeRange: string = 'short_term',
  limit = 10,
) => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch top tracks');
  }

  return response.json();
};

export const getTopArtists = async (
  timeRange: string = 'short_term',
  limit = 10,
) => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch top artists');
  }

  return response.json();
};

export const getPlaylists = async (limit = 10) => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  const response = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch playlists');
  }

  return response.json();
};
