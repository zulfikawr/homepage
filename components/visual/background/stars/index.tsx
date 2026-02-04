'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import Stars from './component';

export default function StarsBackground() {
  const { resolvedTheme } = useTheme();

  const [starColor, setStarColor] = useState('#ebdbb2');

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue('--foreground').trim() || '#ebdbb2';
    requestAnimationFrame(() => {
      setStarColor(color);
    });
  }, [resolvedTheme]);

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
              var(--color-theme-orange),
              transparent
            ),
            radial-gradient(
              circle at 20% 80%,
              var(--color-theme-aqua),
              transparent
            );
          background-blend-mode: soft-light;
        }
      `}</style>
    </div>
  );
}
