import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Button } from '~/components/UI';
import { pageLayout } from '~/components/Page';
import { NextPageWithLayout } from '../_app';
import { auth, signInWithEmailAndPassword } from '~/lib/firebase';
import Link from 'next/link';
import { useAuth } from '~/contexts/authContext';

const Login: NextPageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // If the user is already logged in, show a message and options to go home or logout
  if (user) {
    return (
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='w-full max-w-md mx-auto rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <div className='px-6 py-6'>
            <p className='text-center text-lg dark:text-white'>
              You are already logged in.
            </p>
            <div className='mt-4 flex justify-center space-x-4'>
              <Button
                type='default'
                onClick={() => router.push('/')}
                className='rounded-md bg-blue-500 text-black dark:text-white px-4 py-2 shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              >
                Go to Home
              </Button>
              <Button
                type='default'
                onClick={async () => {
                  await auth.signOut();
                  router.push('/login');
                }}
                className='rounded-md bg-red-500 text-black dark:text-white px-4 py-2 shadow-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the authentication status is still loading, show a loading message
  if (loading) {
    return (
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='w-full max-w-md mx-auto rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <div className='px-6 py-6'>
            <p className='text-center text-lg dark:text-white'>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If the user is not logged in, show the login form
  return (
    <>
      <Head>
        <title>Login - Zulfikar</title>
        <meta name='description' content='Login to access your account' />
        <meta name='robots' content='noindex' />
      </Head>
      <div className='mt-0 pt-24 lg:mt-20 lg:pt-0'>
        <div className='mb-4 flex items-center'>
          <div className='flex-1'>
            <h1 className='text-1 font-medium tracking-wide text-black dark:text-white'>
              <span className='mr-3'>🔑</span> Login
            </h1>
          </div>
          <div className='mt-2 flex h-full items-center justify-end'>
            <p className='text-xl text-gray-500 dark:text-gray-400'>
              <Link href='/' className='flex items-center'>
                <span className='mr-2 h-6 w-6'>&larr;</span>
                Home
              </Link>
            </p>
          </div>
        </div>

        <div className='w-full max-w-md mx-auto rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'>
          <div className='px-6 py-6'>
            <form onSubmit={handleLogin} className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium dark:text-white'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium dark:text-white'
                >
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>

              {error && <p className='text-sm text-red-500'>{error}</p>}

              <div className='flex justify-end pt-4'>
                <Button type='primary' onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

Login.layout = pageLayout;

export default Login;
