'use client';

import { Button } from '@/components/UI';
import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='mt-0 flex h-[65vh] items-center justify-center pt-24 lg:mt-20 lg:pt-0'>
      <div className='text-center'>
        <h1 className='mb-0.5 text-3xl font-medium leading-14 tracking-wide text-black dark:text-white lg:text-4xl'>
          Oops
        </h1>
        <p className='text-base font-light leading-14 tracking-wide text-neutral-500 lg:text-lg'>
          {error.message || 'Something went wrong!'}
        </p>
        <div className='mt-4 flex justify-center gap-2'>
          <Button
            type='primary'
            onClick={() => {
              reset();
            }}
          >
            Try Again
          </Button>
          <Button
            type='default'
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
