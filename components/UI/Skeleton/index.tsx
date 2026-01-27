'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radiusContext';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangle' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangle',
  width,
  height,
  style,
  as: Component = 'div',
}) => {
  const { radius } = useRadius();

  const baseStyles = 'animate-pulse bg-muted dark:bg-muted/50';

  const variantStyles = {
    rectangle: '',
    circle: 'rounded-full',
    text: 'h-4 w-full rounded',
  };

  const combinedStyle: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: variant === 'circle' ? '9999px' : `${radius}px`,
    ...style,
  };

  return (
    <Component
      className={twMerge(baseStyles, variantStyles[variant], className)}
      style={combinedStyle}
    />
  );
};

export { Skeleton };
