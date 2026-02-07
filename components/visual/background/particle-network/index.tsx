import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import ParticleNetwork from './component';

export default function ParticleNetworkBackground({
  isPreview = false,
  theme,
}: {
  isPreview?: boolean;
  theme?: string;
}) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [colors, setColors] = useState({
    particle: '#83a598',
    line: 'rgba(235, 219, 178, 0.2)',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = isPreview
        ? containerRef.current
        : document.documentElement;
      if (!target) return;

      const style = getComputedStyle(target);
      const particle =
        style.getPropertyValue('--theme-blue').trim() || '#83a598';
      const fg = style.getPropertyValue('--foreground').trim() || '#ebdbb2';

      setColors({
        particle,
        line: fg.startsWith('#') ? `${fg}33` : fg, // 33 is approx 0.2 opacity in hex
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [resolvedTheme, isPreview, theme]);

  return (
    <div
      ref={containerRef}
      className={`${isPreview ? 'absolute' : 'fixed'} inset-0 -z-10 min-h-dvh w-full pointer-events-none overflow-hidden`}
    >
      <ParticleNetwork
        particleColor={colors.particle}
        lineColor={colors.line}
        className='absolute top-0 left-0 h-full w-full'
      />
    </div>
  );
}
