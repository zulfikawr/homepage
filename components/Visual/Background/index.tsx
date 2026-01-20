'use client';

import { useBackground } from '@/contexts/backgroundContext';
import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

const CloudAndStarsBackground = dynamic(() => import('./CloudsAndStars'), {
  ssr: false,
});
const WavesBackground = dynamic(() => import('./Waves'), { ssr: false });
const TetrisBackground = dynamic(() => import('./Tetris'), { ssr: false });
const StarsBackground = dynamic(() => import('./Stars'), { ssr: false });
const DigitalRainBackground = dynamic(() => import('./Matrix'), { ssr: false });
const ParticleNetworkBackground = dynamic(() => import('./ParticleNetwork'), {
  ssr: false,
});

const emptySubscribe = () => () => {};

export default function DynamicBackground() {
  const { background } = useBackground();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  if (background === 'waves') return <WavesBackground />;
  if (background === 'tetris') return <TetrisBackground />;
  if (background === 'stars') return <StarsBackground />;
  if (background === 'matrix') return <DigitalRainBackground />;
  if (background === 'network') return <ParticleNetworkBackground />;
  return <CloudAndStarsBackground />;
}
