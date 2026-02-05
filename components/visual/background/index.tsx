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

export default function DynamicBackground({
  isPreview = false,
  background: backgroundProp,
  theme,
}: {
  isPreview?: boolean;
  background?: string;
  theme?: string;
}) {
  const { background: contextBackground } = useBackground();
  const background = backgroundProp || contextBackground;

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  if (background === 'waves')
    return <WavesBackground isPreview={isPreview} theme={theme} />;
  if (background === 'tetris')
    return <TetrisBackground isPreview={isPreview} />;
  if (background === 'stars')
    return <StarsBackground isPreview={isPreview} theme={theme} />;
  if (background === 'matrix')
    return <DigitalRainBackground isPreview={isPreview} theme={theme} />;
  if (background === 'network')
    return <ParticleNetworkBackground isPreview={isPreview} theme={theme} />;
  return null;
}
