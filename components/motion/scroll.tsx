'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface Props {
  handler: (position: number) => void;
  startPosition?: number;
  endPosition: number;
  children: React.ReactNode;
}

const ScrollWrapper = (props: Props) => {
  const {
    handler: applyEffect,
    startPosition = 0,
    endPosition,
    children,
  } = props;
  const { resolvedTheme } = useTheme();
  const [yOffset, setYOffset] = useState<number | null>(null);

  const handler = useCallback(() => {
    let position = window.scrollY;

    if (position < startPosition) {
      position = 0;
    }

    if (position >= endPosition) {
      position = endPosition;
    }

    setYOffset(position);
    applyEffect(position);
  }, [startPosition, endPosition, applyEffect]);

  useEffect(() => {
    // Call handler immediately on mount to set initial state
    requestAnimationFrame(() => {
      handler();
    });

    window.addEventListener('scroll', handler, { passive: true });

    return () => {
      window.removeEventListener('scroll', handler);
    };
  }, [handler, resolvedTheme]);

  // Only hide when yOffset is explicitly less than startPosition
  // This prevents hiding content on initial render
  if (yOffset !== null && yOffset < startPosition) {
    return null;
  }

  return <>{children}</>;
};

export default ScrollWrapper;
