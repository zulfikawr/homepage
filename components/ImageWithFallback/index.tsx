'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

type FallbackType = 'landscape' | 'square' | 'portrait';

interface ImageWithFallbackProps extends ImageProps {
  type?: FallbackType;
}

export default function ImageWithFallback({
  src,
  alt,
  type = 'landscape',
  className,
  ...props
}: ImageWithFallbackProps) {
  const fallbackMap: Record<FallbackType, string> = {
    landscape: '/images/placeholder.png',
    square: '/images/placeholder-square.png',
    portrait: '/images/placeholder-portrait.png',
  };

  const fallback = fallbackMap[type];
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { radius } = useRadius();

  const currentSrc = hasError || !src ? fallback : src;

  return (
    <Image
      {...props}
      key={typeof src === 'string' ? src : 'fallback'}
      alt={alt}
      src={currentSrc}
      onError={() => setHasError(true)}
      onLoad={() => setIsLoading(false)}
      className={twMerge(
        'transition duration-300',
        isLoading ? 'blur-sm' : '',
        className,
      )}
      style={{ borderRadius: `${radius}px` }}
    />
  );
}
