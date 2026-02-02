'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import { LogoutConfirm } from '@/components/UI/Modal/LogoutConfirm';
import { login as setAuth, logout as clearAuth } from '@/lib/auth';

export function useAuthActions() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      interface LoginResponse {
        success: boolean;
        user?: {
          id: string;
          email: string;
          role: string;
        };
        error?: string;
      }

      const result = (await res.json()) as LoginResponse;

      if (!res.ok || !result.success || !result.user) {
        throw new Error(result.error || 'Invalid credentials');
      }

      setAuth(result.user);
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
    toast.show('GitHub login not yet implemented for D1.', 'error');
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/');
    router.refresh();
    toast.show('Logged out successfully!');
  };

  const confirmLogout = () => {
    modal.open(
      React.createElement(LogoutConfirm, {
        onConfirm: () => {
          clearAuth();
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
