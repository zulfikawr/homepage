'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radiusContext';

type FallbackType = 'landscape' | 'square' | 'portrait';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null | undefined;
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

  // Determine the effective source
  let currentSrc: string = fallback;
  if (!hasError && src && typeof src === 'string' && src.trim() !== '') {
    currentSrc = src;
  }

  // Storage URLs and local public images should probably be unoptimized if they fail the URL check
  const isStorageUrl = currentSrc.startsWith('/api/storage/');

  return (
    <Image
      {...props}
      key={currentSrc}
      alt={alt}
      src={currentSrc}
      unoptimized={isStorageUrl || props.unoptimized}
      onError={() => {
        if (!hasError) {
          console.error('ImageWithFallback: error loading', src);
          setHasError(true);
        }
      }}
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
