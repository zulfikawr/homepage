'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import pb from '@/lib/pocketbase';
import { toast } from '@/components/Toast';
import { modal } from '@/components/Modal';
import { Button } from '@/components/UI';

export function useAuthActions() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError('');
    try {
      // Strategy: Try admin first as this is a personal site management dashboard
      try {
        await pb.admins.authWithPassword(email, password);
      } catch (adminErr: any) {
        // If admin fails, try regular user
        await pb.collection('users').authWithPassword(email, password);
      }

      router.push('/database');
      router.refresh();
      toast.show('You are now logged in!');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate.');
      toast.show(err.message || 'Failed to authenticate.', 'error');
    }
  };

  const handleGithubLogin = async () => {
    try {
      await pb.collection('users').authWithOAuth2({ provider: 'github' });
      router.push('/');
      toast.show('You are now logged in with GitHub!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const confirmLogout = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Logout</h2>
        <p className='mb-6'>Are you sure you want to logout?</p>
        <div className='flex justify-end space-x-4'>
          <Button onClick={() => modal.close()}>Cancel</Button>
          <Button
            type='destructive'
            onClick={() => {
              pb.authStore.clear();
              modal.close();
              router.push('/');
              router.refresh();
              toast.show('Logged out successfully!');
            }}
          >
            Logout
          </Button>
        </div>
      </div>,
    );
  };

  return { handleLogin, handleGithubLogin, confirmLogout, error };
}
