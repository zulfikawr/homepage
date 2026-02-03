'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from '@/components/ui';
import { Skeleton } from '@/components/ui';

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

          const data = (await response.json()) as { error?: string };

          if (!response.ok) {
            throw new Error(data.error || 'Failed to exchange token');
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

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <Skeleton width={48} height={48} variant='circle' />
      <Skeleton width={200} height={24} />
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
          <Skeleton width={48} height={48} variant='circle' />
          <Skeleton width={200} height={24} />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
