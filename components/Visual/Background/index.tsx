'use client';

import { useBackground } from '@/contexts/backgroundContext';
import CloudAndStarsBackground from './CloudsAndStars';
import WavesBackground from './Waves';
import TetrisBackground from './Tetris';
import StarsBackground from './Stars';
import DigitalRainBackground from './Matrix';
import ParticleNetworkBackground from './Matrix';
import { useSyncExternalStore } from 'react';

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
