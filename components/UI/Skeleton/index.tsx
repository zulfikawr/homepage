'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangle' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangle',
  width,
  height,
}) => {
  const { radius } = useRadius();

  const baseStyles = 'animate-pulse bg-muted dark:bg-muted/50';

  const variantStyles = {
    rectangle: '',
    circle: 'rounded-full',
    text: 'h-4 w-full rounded',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: variant === 'circle' ? '9999px' : `${radius}px`,
  };

  return (
    <div
      className={twMerge(baseStyles, variantStyles[variant], className)}
      style={style}
    />
  );
};

export { Skeleton };
