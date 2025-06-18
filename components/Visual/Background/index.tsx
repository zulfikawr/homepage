'use client';

import { useBackground } from '@/contexts/backgroundContext';
import CloudAndStarsBackground from './CloudsAndStars';
import WavesBackground from './Waves';
import TetrisBackground from './Tetris';

export default function DynamicBackground() {
  const { background } = useBackground();

  if (background === 'waves') return <WavesBackground />;
  if (background === 'tetris') return <TetrisBackground />;
  return <CloudAndStarsBackground />;
}
