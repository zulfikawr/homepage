import React, { useState, useEffect } from 'react';
import { Button, Input, FormLabel, Skeleton } from '@/components/UI';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { Card } from '@/components/Card';

export default function LoginContent() {
  const { handleGithubLogin, handlePasswordLogin, loading } = useAuthActions();
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

  const onPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await handlePasswordLogin(email, password);
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
          <Card isPreview className='p-8 space-y-6'>
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
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto mt-20'>
      <PageTitle emoji='🔐' title='Login' subtitle='Welcome back' />

      <Card isPreview className='p-8'>
        <div className='flex flex-col space-y-6'>
          <Button
            onClick={handleGithubLogin}
            icon='githubLogo'
            className='w-full h-11'
          >
            Continue with GitHub
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-border dark:border-border' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-muted-foreground dark:bg-card'>
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={onPasswordLogin} className='space-y-4'>
            <div className='space-y-2'>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className='text-sm text-destructive'>{error}</p>}

            <div className='flex justify-end pt-2'>
              <Button
                type='primary'
                nativeType='submit'
                className='w-full h-11'
                icon='signIn'
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
