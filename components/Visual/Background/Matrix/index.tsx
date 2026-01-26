import { useTheme } from 'next-themes';

import DigitalRain from './component';

export default function DigitalRainBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const characterColor = '#b8bb26'; // gruv-green
  const fadeColor = isDark
    ? 'rgba(40, 40, 40, 0.05)' // gruv-bg
    : 'rgba(251, 241, 199, 0.05)'; // gruv-bg (light)

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen pointer-events-none overflow-hidden'>
      <DigitalRain
        characterColor={characterColor}
        fadeColor={fadeColor}
        className='absolute top-0 left-0 h-full w-full'
      />
    </div>
  );
}
