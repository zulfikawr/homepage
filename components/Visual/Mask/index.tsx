'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface MaskProps {
  children: React.ReactNode;
  className?: string;
  fadeWidth?: number;
}

const Mask: React.FC<MaskProps> = ({ children, className, fadeWidth = 40 }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    left: false,
    right: false,
  });
  const [containerWidth, setContainerWidth] = useState(0);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setContainerWidth(clientWidth);
    setScrollState({
      left: scrollLeft > 10,
      right: scrollLeft < scrollWidth - clientWidth - 10,
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    // Initial check after a short delay to account for content rendering
    const timeoutId = setTimeout(updateScrollState, 100);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      clearTimeout(timeoutId);
    };
  }, [children]);

  const maskStyles = useMemo(() => {
    const { left, right } = scrollState;
    const width = containerWidth || 1;

    return {
      '--mask-left': left ? `${(fadeWidth / width) * 100}%` : '0%',
      '--mask-right': right ? `${(fadeWidth / width) * 100}%` : '0%',
      maskImage:
        'linear-gradient(to right, transparent 0%, black var(--mask-left), black calc(100% - var(--mask-right)), transparent 100%)',
      WebkitMaskImage:
        'linear-gradient(to right, transparent 0%, black var(--mask-left), black calc(100% - var(--mask-right)), transparent 100%)',
      transition: '--mask-left 0.3s ease, --mask-right 0.3s ease',
    } as React.CSSProperties;
  }, [scrollState, fadeWidth, containerWidth]);

  return (
    <div
      ref={scrollRef}
      className={twMerge('w-full overflow-x-auto min-w-0', className)}
      style={maskStyles}
    >
      {children}
    </div>
  );
};

export default Mask;
