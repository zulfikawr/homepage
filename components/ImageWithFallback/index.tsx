'use client';

import { useState, useEffect } from 'react';
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
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [isLoading, setIsLoading] = useState(true);

  const { radius } = useRadius();

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <Image
      {...props}
      alt={alt}
      src={imgSrc}
      onError={() => setImgSrc(fallback)}
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
