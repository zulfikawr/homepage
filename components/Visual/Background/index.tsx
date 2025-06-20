'use client';

import { useBackground } from '@/contexts/backgroundContext';
import CloudAndStarsBackground from './CloudsAndStars';
import WavesBackground from './Waves';
import TetrisBackground from './Tetris';
import StarsBackground from './Stars';
import DigitalRainBackground from './Matrix';
import ParticleNetworkBackground from './ParticleNetwork';

export default function DynamicBackground() {
  const { background } = useBackground();

  if (background === 'waves') return <WavesBackground />;
  if (background === 'tetris') return <TetrisBackground />;
  if (background === 'stars') return <StarsBackground />;
  if (background === 'matrix') return <DigitalRainBackground />;
  if (background === 'network') return <ParticleNetworkBackground />;
  return <CloudAndStarsBackground />;
}
