'use client';

import { useTheme } from 'next-themes';
import Stars from './component';

export default function StarsBackground() {
  const { resolvedTheme } = useTheme();

  const starColor = resolvedTheme === 'dark' ? '#ebdbb2' : '#3c3836';

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen pointer-events-none overflow-hidden'>
      <Stars
        starColor={starColor}
        className='absolute top-0 left-0 w-full h-full'
      />

      <style jsx global>{`
        body {
          background-image:
            radial-gradient(
              circle at top right,
              rgba(254, 128, 25, 0.08),
              transparent
            ),
            radial-gradient(
              circle at 20% 80%,
              rgba(142, 192, 124, 0.08),
              transparent
            );
        }
      `}</style>
    </div>
  );
}
