import { database, ref, set, get } from './firebase';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-top-read',
].join(' ');

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: REDIRECT_URI!,
    scope: SCOPES,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

export const getAccessToken = async () => {
  try {
    const tokensRef = ref(database, 'spotify/tokens');
    const snapshot = await get(tokensRef);
    const tokens = snapshot.val();

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

      // Update token in Firebase
      await set(ref(database, 'spotify/tokens'), {
        access_token: data.access_token,
        refresh_token: tokens.refresh_token,
        timestamp: Date.now(),
      });

      return data.access_token;
    }

    return tokens.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
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

export const getRecentlyPlayed = async () => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  return fetch(
    'https://api.spotify.com/v1/me/player/recently-played?limit=10',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
};

export const getTopTracks = async () => {
  const access_token = await getAccessToken();
  if (!access_token) return null;

  return fetch(
    'https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  );
};
