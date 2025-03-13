'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { Button, FormLabel, Input } from '@/components/UI';
import PageTitle from '@/components/PageTitle';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';

export default function LoginContent() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { user, loading } = useAuth();
  const { handleLogin, confirmLogout, error } = useAuthActions();
  const router = useRouter();

  return (
    <div>
      <PageTitle
        emoji='🔑'
        title='Login'
        subtitle='Admin login to manage database.'
        route='/login'
      />

      {loading ? (
        <div className='mt-0 flex h-[65vh] items-center justify-center pt-24 lg:mt-20 lg:pt-0'>
          <div className='p-4'>
            <p className='text-center text-lg dark:text-white'>Loading...</p>
          </div>
        </div>
      ) : user ? (
        <div className='w-full max-w-[400px] mx-auto rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
          <div className='px-6 py-12'>
            <p className='text-center text-lg dark:text-white'>
              You are already logged in.
            </p>
            <div className='mt-4 flex justify-center space-x-4'>
              <Button type='primary' onClick={() => router.push('/')}>
                Go to Home
              </Button>
              <Button type='destructive' onClick={confirmLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='px-6 py-12'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
            className='space-y-4 max-w-[400px] mx-auto rounded-md border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900 p-6'
          >
            <div>
              <FormLabel htmlFor='email' required>
                Email
              </FormLabel>
              <Input
                type='email'
                value={email}
                placeholder='admin.email@mail.com'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <FormLabel htmlFor='password' required>
                Password
              </FormLabel>
              <Input
                type='password'
                value={password}
                placeholder='********'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className='text-sm text-red-500'>{error}</p>}

            <div className='flex justify-end pt-4'>
              <Button
                type='primary'
                onClick={() => handleLogin(email, password)}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
