'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import Waves from './component';

export default function WavesBackground() {
  const { resolvedTheme } = useTheme();

  // Use a ref or state to get computed styles if needed,
  // but for canvas we often need hex/rgba.
  // We can use a trick: read the CSS variable from the document.
  const [colors, setColors] = useState({
    line: '#8ec07c',
    bg: 'rgba(235, 219, 178, 0.1)',
  });

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const line = style.getPropertyValue('--theme-aqua').trim() || '#8ec07c';
    const fg = style.getPropertyValue('--foreground').trim() || '#3c3836';

    requestAnimationFrame(() => {
      setColors({
        line,
        bg: `${fg}1a`, // Add hex opacity if it's hex, or just use a fixed opacity
      });
    });
  }, [resolvedTheme]);

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen'>
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
