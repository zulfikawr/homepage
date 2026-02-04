import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import DigitalRain from './component';

export default function DigitalRainBackground() {
  const { resolvedTheme } = useTheme();

  const [colors, setColors] = useState({ char: '#b8bb26', fade: 'rgba(40, 40, 40, 0.05)' });

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const char = style.getPropertyValue('--theme-green').trim() || '#b8bb26';
    const bg = style.getPropertyValue('--background').trim() || '#282828';
    
    setColors({
      char,
      fade: bg.startsWith('#') ? `${bg}0d` : bg, // 0d is approx 0.05 opacity in hex
    });
  }, [resolvedTheme]);

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen pointer-events-none overflow-hidden'>
      <DigitalRain
        characterColor={colors.char}
        fadeColor={colors.fade}
        className='absolute top-0 left-0 h-full w-full'
      />
    </div>
  );
}
