import PocketBase from 'pocketbase';

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pocketbase.zulfikar.site',
);

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

  // Use consistent base URL from environment or fallback
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://dev.zulfikar.site');
  const redirectUri = `${baseUrl}/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
  });

  const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  console.log('Generated Spotify Auth URL:', authUrl);
  console.log('Redirect URI being used:', redirectUri);
  return authUrl;
};

export async function getAccessToken() {
  const tokens = await pb
    .collection('spotify_tokens')
    .getOne('spotify', { requestKey: null });

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

    const data = await response.json();

    if (data.access_token) {
      accessToken = data.access_token;

      const adminEmail = process.env.PB_ADMIN_EMAIL;
      const adminPass = process.env.PB_ADMIN_PASSWORD;

      if (adminEmail && adminPass) {
        try {
          const adminPb = new PocketBase(
            process.env.NEXT_PUBLIC_POCKETBASE_URL,
          );
          await adminPb
            .collection('_superusers')
            .authWithPassword(adminEmail, adminPass);
          await adminPb.collection('spotify_tokens').update('spotify', {
            access_token: data.access_token,
            refresh_token: data.refresh_token || tokens.refresh_token,
            timestamp: Date.now(),
          });
        } catch (pbError) {
          console.error('Failed to update PB with admin credentials:', pbError);
        }
      }
    }
  }

  return accessToken;
}

export async function saveSpotifyTokens(
  accessToken: string,
  refreshToken: string,
) {
  const adminEmail = process.env.PB_ADMIN_EMAIL;
  const adminPass = process.env.PB_ADMIN_PASSWORD;

  if (!adminEmail || !adminPass) {
    throw new Error('Admin credentials not configured');
  }

  const adminPb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  await adminPb
    .collection('_superusers')
    .authWithPassword(adminEmail, adminPass);

  try {
    // Try to update existing record
    return await adminPb.collection('spotify_tokens').update('spotify', {
      access_token: accessToken,
      refresh_token: refreshToken,
      timestamp: Date.now(),
    });
  } catch {
    // If record doesn't exist, create it
    return await adminPb.collection('spotify_tokens').create({
      id: 'spotify',
      access_token: accessToken,
      refresh_token: refreshToken,
      timestamp: Date.now(),
    });
  }
}
