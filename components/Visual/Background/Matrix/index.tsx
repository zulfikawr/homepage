import { useTheme } from 'next-themes';
import DigitalRain from './component';

export default function DigitalRainBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const characterColor = isDark ? '#00F000' : '#000000';
  const fadeColor = isDark
    ? 'rgba(0, 0, 0, 0.05)'
    : 'rgba(255, 255, 255, 0.05)';

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
