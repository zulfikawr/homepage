'use client';

import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { Button } from '../UI';

export default function AdminProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className='flex h-[50vh] w-full items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-800 dark:border-border dark:border-t-white'></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className='w-full mx-auto rounded-md border bg-white shadow-sm dark:border-border dark:bg-card'>
        <div className='px-6 py-10'>
          <p className='text-center text-lg dark:text-white'>
            You are not authorized to access this page.
          </p>
          <div className='mt-4 flex justify-center'>
            <Button onClick={() => router.push('/')}>Go to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
