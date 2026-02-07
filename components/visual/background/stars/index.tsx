'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import Stars from './component';

export default function StarsBackground({
  isPreview = false,
  theme,
}: {
  isPreview?: boolean;
  theme?: string;
}) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [starColor, setStarColor] = useState('#ebdbb2');

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = isPreview
        ? containerRef.current
        : document.documentElement;
      if (!target) return;

      const style = getComputedStyle(target);
      const color = style.getPropertyValue('--foreground').trim() || '#ebdbb2';
      setStarColor(color);
    }, 50);

    return () => clearTimeout(timer);
  }, [resolvedTheme, isPreview, theme]);

  return (
    <div
      ref={containerRef}
      className={`${isPreview ? 'absolute' : 'fixed'} inset-0 -z-10 min-h-dvh w-full pointer-events-none overflow-hidden`}
    >
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
