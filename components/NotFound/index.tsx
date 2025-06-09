'use client';

import { Button } from '@/components/UI';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='mt-0 flex h-[65vh] items-center justify-center pt-24 lg:mt-20 lg:pt-0'>
      <div className='text-center'>
        <h1 className='mb-0.5 text-3xl font-medium leading-14 tracking-wide text-black dark:text-white lg:text-1'>
          Oops
        </h1>
        <p className='text-3 font-light leading-14 tracking-wide text-neutral-500 lg:text-2'>
          404 Not Found
        </p>
        <div className='mt-4 inline-block justify-center'>
          <Button
            type='primary'
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
