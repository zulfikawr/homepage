'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ViewTransition } from '@/components/motion';
import PageTitle from '@/components/page-title';
import { Button, FormLabel, Input, Skeleton } from '@/components/ui';
import { useAuth } from '@/contexts/auth-context';
import { useAuthActions } from '@/hooks/use-auth-actions';

export default function LoginContent() {
  const { handleLogin, loading } = useAuthActions();
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/database');
    }
  }, [user, router]);

  const onPasswordLogin = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    setError('');
    try {
      await handleLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (loading) {
    return (
      <div className='max-w-md mx-auto mt-20 p-6'>
        <div className='space-y-8'>
          <div className='space-y-4'>
            <Skeleton width={150} height={32} />
            <Skeleton width='100%' height={20} />
          </div>
          <div className='py-8 space-y-4'>
            <div className='space-y-2'>
              <Skeleton width={80} height={20} />
              <Skeleton width='100%' height={40} />
            </div>
            <div className='space-y-2'>
              <Skeleton width={80} height={20} />
              <Skeleton width='100%' height={40} />
            </div>
            <Skeleton width='100%' height={44} className='mt-6' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageTitle emoji='🔐' title='Login' subtitle='Welcome back' />

      <ViewTransition>
        <div className='max-w-md mx-auto mt-12 flex flex-col space-y-8'>
          <form onSubmit={onPasswordLogin} className='space-y-6'>
            <div className='space-y-5'>
              <div className='space-y-2'>
                <FormLabel
                  htmlFor='email'
                  className='text-theme-fg-dim text-sm'
                >
                  Email Address
                </FormLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='h-11'
                />
              </div>
              <div className='space-y-2'>
                <FormLabel
                  htmlFor='password'
                  required
                  className='text-theme-fg-dim text-sm'
                >
                  Password
                </FormLabel>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='h-11'
                />
              </div>
            </div>

            {error && (
              <p className='text-sm text-theme-red text-center italic'>
                {error}
              </p>
            )}

            <Button
              variant='primary'
              nativeType='submit'
              className='w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold'
              icon='signIn'
            >
              Sign In
            </Button>
          </form>
        </div>
      </ViewTransition>
    </div>
  );
}
