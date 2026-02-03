'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='mt-0 flex h-[65vh] items-center justify-center pt-24 lg:mt-20 lg:pt-0'>
      <div className='text-center'>
        <h1 className='mb-0.5 text-3xl font-medium leading-14 tracking-wide text-foreground lg:text-4xl'>
          Oops
        </h1>
        <p className='text-base font-light leading-14 tracking-wide text-muted-foreground lg:text-lg'>
          404 Not Found
        </p>
        <div className='mt-4 inline-block justify-center'>
          <Button
            variant='primary'
            onClick={() => {
              router.push('/');
            }}
            className='mx-auto'
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
