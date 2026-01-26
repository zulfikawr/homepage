import { useTheme } from 'next-themes';

import ParticleNetwork from './component';

export default function ParticleNetworkBackground() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const particleColor = '#83a598'; // gruv-blue
  const lineColor = isDark
    ? 'rgba(235, 219, 178, 0.2)'
    : 'rgba(60, 56, 54, 0.2)'; // gruv-fg with opacity

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
