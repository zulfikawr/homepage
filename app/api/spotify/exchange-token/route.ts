import { NextRequest, NextResponse } from 'next/server';

import { saveSpotifyTokens } from '@/lib/spotify';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { code } = (await request.json()) as { code: string };

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 },
      );
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const redirectUri = `${baseUrl}/callback`;

    console.log('Exchange token - Base URL:', baseUrl);
    console.log('Exchange token - Redirect URI:', redirectUri);

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Spotify credentials not configured' },
        { status: 500 },
      );
    }

    // Exchange authorization code for access token
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

    interface SpotifyTokenResponse {
      access_token?: string;
      refresh_token?: string;
      error?: string;
      error_description?: string;
    }

    const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;

    console.log('Spotify token response status:', tokenResponse.status);
    console.log('Spotify token response:', tokenData);

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    // Save tokens to database
    if (tokenData.access_token && tokenData.refresh_token) {
      await saveSpotifyTokens(tokenData.access_token, tokenData.refresh_token);
    } else {
      throw new Error('Missing tokens in Spotify response');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to exchange Spotify token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
