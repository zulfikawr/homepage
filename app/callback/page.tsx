'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Icon, toast } from '@/components/ui';
import { Shimmer } from '@/components/ui/shimmer';

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
          // Call server-side endpoint to exchange code for tokens
          const response = await fetch('/api/spotify/exchange-token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          const result = (await response.json()) as {
            success: boolean;
            error?: string;
          };

          if (!response.ok) {
            throw new Error(result.error || 'Failed to exchange token');
          }

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

  return <CallbackLayout />;
}

const CallbackLayout = () => (
  <Shimmer loading>
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <Icon name='spotifyLogo' className='size-12 text-theme-green' />
      <p className='text-lg font-medium'>Connecting to Spotify…</p>
    </div>
  </Shimmer>
);

export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackLayout />}>
      <CallbackContent />
    </Suspense>
  );
}
