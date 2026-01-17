'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // PocketBase OAuth callback handling
    const params = new URL(window.location.href).searchParams;
    if (params.has('code')) {
      // In a real PocketBase setup, the authWithOAuth2 handles this,
      // but you might need to handle the return if you use manual flow.
      router.push('/');
    }
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <p>Processing login...</p>
    </div>
  );
}
