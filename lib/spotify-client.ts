/**
 * Client-safe Spotify utilities that don't depend on server-only bindings.
 */

export const getSpotifyAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  if (!clientId) {
    console.error('NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not set');
    return '#';
  }

  const host =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_DEV_URL || 'dev.zulfikar.site'
      : process.env.NEXT_PUBLIC_BASE_URL || 'zulfikar.site';

  const baseUrl = `https://${host}`;

  const redirectUri = `${baseUrl}/callback`;

  const SCOPES = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-top-read',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};
