import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

import DigitalRain from './component';

export default function DigitalRainBackground({
  isPreview = false,
  theme,
}: {
  isPreview?: boolean;
  theme?: string;
}) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [colors, setColors] = useState({
    char: '#b8bb26',
    fade: 'rgba(40, 40, 40, 0.05)',
  });

  useEffect(() => {
    // Small delay to ensure the parent's theme class has been applied to the DOM
    const timer = setTimeout(() => {
      const target = isPreview
        ? containerRef.current
        : document.documentElement;
      if (!target) return;

      const style = getComputedStyle(target);
      const char = style.getPropertyValue('--theme-green').trim() || '#b8bb26';
      const bg = style.getPropertyValue('--background').trim() || '#282828';

      setColors({
        char,
        fade: bg.startsWith('#') ? `${bg}0d` : bg, // 0d is approx 0.05 opacity in hex
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [resolvedTheme, isPreview, theme]);

  return (
    <div
      ref={containerRef}
      className={`${isPreview ? 'absolute' : 'fixed'} inset-0 -z-10 min-h-dvh w-full pointer-events-none overflow-hidden`}
    >
      <DigitalRain
        characterColor={colors.char}
        fadeColor={colors.fade}
        className='absolute top-0 left-0 h-full w-full'
      />
    </div>
  );
}
