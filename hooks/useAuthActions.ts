'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import { LogoutConfirm } from '@/components/UI/Modal/LogoutConfirm';
import pb from '@/lib/pocketbase';

export function useAuthActions() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      await pb.collection('users').authWithOAuth2({ provider: 'github' });
      router.push('/');
      toast.show('You are now logged in with GitHub!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    router.push('/');
    router.refresh();
    toast.show('Logged out successfully!');
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

  return {
    handleLogin,
    handleGithubLogin,
    handleLogout,
    confirmLogout,
    error,
    loading,
  };
}
