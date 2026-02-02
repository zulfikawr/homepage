'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ViewTransition } from '@/components/Motion';
import PageTitle from '@/components/PageTitle';
import { Button, FormLabel, Input, Skeleton } from '@/components/UI';
import { useAuth } from '@/contexts/authContext';
import { useAuthActions } from '@/hooks/useAuthActions';

export default function LoginContent() {
  const { handleGithubLogin, handleLogin, loading } = useAuthActions();
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/');
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
          <div className='py-8 space-y-6'>
            <Skeleton width='100%' height={44} />
            <div className='relative'>
              <Skeleton width='100%' height={1} />
            </div>
            <div className='space-y-4'>
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
      </div>
    );
  }

  return (
    <div>
      <PageTitle emoji='🔐' title='Login' subtitle='Welcome back' />

      <ViewTransition>
        <div className='max-w-md mx-auto mt-12 flex flex-col space-y-8'>
          <Button
            onClick={handleGithubLogin}
            variant='outline'
            icon='githubLogo'
            className='w-full h-12'
          >
            Continue with GitHub
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='px-4 text-gruv-fg-dim tracking-widest'>
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={onPasswordLogin} className='space-y-6'>
            <div className='space-y-5'>
              <div className='space-y-2'>
                <FormLabel htmlFor='email' className='text-gruv-fg-dim text-sm'>
                  Email Address
                </FormLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='bg-transparent border-border focus:border-gruv-aqua transition-colors h-11'
                />
              </div>
              <div className='space-y-2'>
                <FormLabel
                  htmlFor='password'
                  required
                  className='text-gruv-fg-dim text-sm'
                >
                  Password
                </FormLabel>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='bg-transparent border-border focus:border-gruv-aqua transition-colors h-11'
                />
              </div>
            </div>

            {error && (
              <p className='text-sm text-gruv-red text-center italic'>
                {error}
              </p>
            )}

            <Button
              variant='primary'
              nativeType='submit'
              className='w-full h-12 bg-gruv-orange hover:bg-gruv-orange/90 text-gruv-bg-dark font-bold'
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
