'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isProcessing = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code && !isProcessing.current) {
      isProcessing.current = true;

      const exchangeToken = async () => {
        try {
          const origin =
            typeof window !== 'undefined'
              ? window.location.origin
              : 'https://dev.zulfikar.site';
          const redirectUri = `${origin}/callback/`;

          const response = await fetch(
            'https://accounts.spotify.com/api/token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(
                  `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
                )}`,
              },
              body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
              }),
            },
          );

          const data = await response.json();

          if (data.error) {
            throw new Error(data.error_description || data.error);
          }

          // Save to PocketBase
          await pb.collection('spotify_tokens').update('spotify', {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            timestamp: Date.now(),
          });

          toast.success('Spotify connected successfully!');
          router.push('/');
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Failed to connect Spotify',
          );
          router.push('/');
        }
      };

      exchangeToken();
    }
  }, [router, searchParams]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
      <p className='text-lg font-medium'>Connecting to Spotify...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
          <p className='text-lg font-medium'>Loading...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
