'use client';

import { useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';

import { useBackground } from '@/contexts/background-context';

const WavesBackground = dynamic(() => import('./waves'), { ssr: false });
const TetrisBackground = dynamic(() => import('./tetris'), { ssr: false });
const StarsBackground = dynamic(() => import('./stars'), { ssr: false });
const DigitalRainBackground = dynamic(() => import('./matrix'), { ssr: false });
const ParticleNetworkBackground = dynamic(() => import('./particle-network'), {
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
  return null;
}
