'use client';

import Waves from './component';
import { useTheme } from 'next-themes';

export default function WavesBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const lineColor = isDark ? '#fff' : '#000';
  const backgroundColor = isDark
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.2)';

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
