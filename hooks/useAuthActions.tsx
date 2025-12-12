'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  auth,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
} from '@/lib/firebase';
import { toast } from '@/components/Toast';
import { modal } from '@/components/Modal';
import { Button } from '@/components/UI';

export function useAuthActions() {
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/database');
      toast.show('You are now logged in!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
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
            onClick={async () => {
              await signOut(auth);
              modal.close();
              router.push('/');
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
