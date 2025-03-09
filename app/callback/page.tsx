// app/callback/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { database, ref, set } from '@/lib/firebase';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    async function handleCallback() {
      if (!code) {
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
    }

    handleCallback();
  }, [code, router]);

  return <div>Processing Spotify authentication...</div>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
