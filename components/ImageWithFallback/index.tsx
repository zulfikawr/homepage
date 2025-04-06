'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type FallbackType = 'landscape' | 'square' | 'portrait';

interface ImageWithFallbackProps extends ImageProps {
  type?: FallbackType;
}

export default function ImageWithFallback({
  src,
  alt,
  type = 'landscape',
  ...props
}: ImageWithFallbackProps) {
  const fallbackMap: Record<FallbackType, string> = {
    landscape: '/images/placeholder.png',
    square: '/images/placeholder-square.png',
    portrait: '/images/placeholder-portrait.png',
  };

  const fallback = fallbackMap[type];
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <Image
      {...props}
      alt={alt}
      src={imgSrc}
      onError={() => setImgSrc(fallback)}
    />
  );
}
