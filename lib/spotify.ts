import { SpotifyRecentlyPlayed } from '@/types/spotify';

import { getDB } from './cloudflare';

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-top-read',
].join(' ');

export const getSpotifyAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (!clientId) {
    console.error('NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not set');
    throw new Error('Spotify client ID is not configured');
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://dev.zulfikar.site';
  const redirectUri = `${baseUrl}/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

interface SpotifyTokensRow {
  id: string;
  access_token: string;
  refresh_token: string;
  timestamp: number;
}

export async function getAccessToken() {
  const db = getDB();
  if (!db) throw new Error('DB not available');

  const tokens = await db
    .prepare('SELECT * FROM spotify_tokens WHERE id = ?')
    .bind('spotify')
    .first<SpotifyTokensRow>();

  if (!tokens) {
    throw new Error('No tokens found');
  }

  let accessToken = tokens.access_token;
  const isExpired = Date.now() - tokens.timestamp > 3600000;

  if (isExpired && tokens.refresh_token) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokens.refresh_token,
      }),
      cache: 'no-store',
    });

    interface SpotifyTokenResponse {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      token_type: string;
    }

    const data = (await response.json()) as SpotifyTokenResponse;

    if (data.access_token) {
      accessToken = data.access_token;

      await db
        .prepare(
          'UPDATE spotify_tokens SET access_token = ?, refresh_token = ?, timestamp = ?, updated_at = unixepoch() WHERE id = ?',
        )
        .bind(
          data.access_token,
          data.refresh_token || tokens.refresh_token,
          Date.now(),
          'spotify',
        )
        .run();
    }
  }

  return accessToken;
}

export async function saveSpotifyTokens(
  accessToken: string,
  refreshToken: string,
) {
  const db = getDB();
  if (!db) throw new Error('DB not available');

  await db
    .prepare(
      `INSERT INTO spotify_tokens (id, access_token, refresh_token, timestamp)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       access_token = excluded.access_token,
       refresh_token = excluded.refresh_token,
       timestamp = excluded.timestamp,
       updated_at = unixepoch()`,
    )
    .bind('spotify', accessToken, refreshToken, Date.now())
    .run();
}

export async function getRecentlyPlayed(limit = 10) {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 300 },
    },
  );
  if (!res.ok) throw new Error('Failed to fetch recently played');
  const data = (await res.json()) as SpotifyRecentlyPlayed;
  return {
    items: data.items.map((item) => ({
      track: item.track,
      playedAt: item.played_at,
    })),
  };
}

export async function getTopTracks(limit = 10, timeRange = 'short_term') {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error('Failed to fetch top tracks');
  return res.json();
}

export async function getTopArtists(limit = 10, timeRange = 'short_term') {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=${limit}&time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error('Failed to fetch top artists');
  return res.json();
}

export async function getPlaylists(limit = 10) {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error('Failed to fetch playlists');
  return res.json();
}
