'use client';

import Waves from './component';
import { useTheme } from 'next-themes';

export default function WavesBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const lineColor = '#8ec07c'; // gruv-aqua
  const backgroundColor = isDark
    ? 'rgba(235, 219, 178, 0.1)' // gruv-fg with opacity
    : 'rgba(60, 56, 54, 0.1)'; // gruv-fg (light) with opacity

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen'>
      <Waves
        lineColor={lineColor}
        backgroundColor={backgroundColor}
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
