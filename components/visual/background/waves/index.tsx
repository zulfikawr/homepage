'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import Waves from './component';

export default function WavesBackground({
  isPreview = false,
  theme,
}: {
  isPreview?: boolean;
  theme?: string;
}) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use a ref or state to get computed styles if needed,
  // but for canvas we often need hex/rgba.
  // We can use a trick: read the CSS variable from the document.
  const [colors, setColors] = useState({
    line: '#8ec07c',
    bg: 'rgba(235, 219, 178, 0.1)',
  });

  useEffect(() => {
    // Small delay to ensure the parent's theme class has been applied to the DOM
    const timer = setTimeout(() => {
      const target = isPreview
        ? containerRef.current
        : document.documentElement;
      if (!target) return;

      const style = getComputedStyle(target);
      const line = style.getPropertyValue('--theme-aqua').trim() || '#8ec07c';
      const fg = style.getPropertyValue('--foreground').trim() || '#3c3836';

      setColors({
        line,
        bg: `${fg}1a`, // Add hex opacity if it's hex, or just use a fixed opacity
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [resolvedTheme, isPreview, theme]);

  return (
    <div
      ref={containerRef}
      className={`${isPreview ? 'absolute' : 'fixed'} inset-0 -z-10 h-full w-full`}
    >
      <Waves
        lineColor={colors.line}
        backgroundColor={colors.bg}
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
    </div>
  );
}
