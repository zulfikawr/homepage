'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import { modal } from '@/components/Modal';
import { LogoutConfirm } from '@/components/Modal/LogoutConfirm';

export function useAuthActions() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError('');
    try {
      try {
        await pb.collection('_superusers').authWithPassword(email, password);
      } catch {
        await pb.collection('users').authWithPassword(email, password);
      }

      router.push('/database');
      router.refresh();
      toast.show('You are now logged in!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to authenticate.';
      setError(message);
      toast.show(message, 'error');
    }
  };

  const handleGithubLogin = async () => {
    try {
      await pb.collection('users').authWithOAuth2({ provider: 'github' });
      router.push('/');
      toast.show('You are now logged in with GitHub!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const confirmLogout = () => {
    modal.open(
      React.createElement(LogoutConfirm, {
        onConfirm: () => {
          pb.authStore.clear();
          router.push('/');
          router.refresh();
          toast.show('Logged out successfully!');
        },
      }),
    );
  };

  return { handleLogin, handleGithubLogin, confirmLogout, error };
}
