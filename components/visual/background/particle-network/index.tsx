import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import ParticleNetwork from './component';

export default function ParticleNetworkBackground() {
  const { resolvedTheme } = useTheme();

  const [colors, setColors] = useState({
    particle: '#83a598',
    line: 'rgba(235, 219, 178, 0.2)',
  });

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const particle = style.getPropertyValue('--theme-blue').trim() || '#83a598';
    const fg = style.getPropertyValue('--foreground').trim() || '#ebdbb2';

    requestAnimationFrame(() => {
      setColors({
        particle,
        line: fg.startsWith('#') ? `${fg}33` : fg, // 33 is approx 0.2 opacity in hex
      });
    });
  }, [resolvedTheme]);

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen pointer-events-none overflow-hidden'>
      <ParticleNetwork
        particleColor={colors.particle}
        lineColor={colors.line}
        className='absolute top-0 left-0 h-full w-full'
      />
    </div>
  );
}
