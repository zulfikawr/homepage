'use client';

import { Suspense, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { database, ref, set } from '@/lib/firebase';
import { useAuth } from '@/contexts/authContext';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const { user, loading } = useAuth();

  const handleCallback = useCallback(async () => {
    if (!code) {
      router.push('/');
      return;
    }

    if (loading) return;

    if (!user) {
      console.warn('Non-owner attempted Spotify callback. Ignoring.');
      router.push('/');
      return;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();

      // Store tokens in Firebase
      await set(ref(database, 'spotify/tokens'), {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        timestamp: Date.now(),
      });

      router.push('/');
    } catch (error) {
      console.error('Error in callback:', error);
      router.push('/');
    }
  }, [code, loading, user, router]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  return <div>Processing Spotify authentication...</div>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
