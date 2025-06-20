import { useTheme } from 'next-themes';
import ParticleNetwork from './component';

export default function ParticleNetworkBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const particleColor = isDark ? '#FFFFFF' : '#000000';
  const lineColor = isDark ? '#4A4A4A' : '#CCCCCC';

  return (
    <div className='fixed inset-0 -z-10 h-screen w-screen pointer-events-none overflow-hidden'>
      <ParticleNetwork
        particleColor={particleColor}
        lineColor={lineColor}
        className='absolute top-0 left-0 h-full w-full'
      />
    </div>
  );
}
