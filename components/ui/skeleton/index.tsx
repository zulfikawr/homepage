'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radius-context';

interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'rectangle' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  as?: React.ElementType;
}

const Skeleton = React.forwardRef<HTMLElement, SkeletonProps>(
  (
    {
      className,
      variant = 'rectangle',
      width,
      height,
      style,
      as: Component = 'div',
      ...props
    },
    ref,
  ) => {
    const { radius } = useRadius();

    const baseStyles = 'animate-pulse bg-muted dark:bg-muted/50 inline-block';

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

    const Tag = Component as 'div';

    return (
      <Tag
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
        ref={ref as React.Ref<HTMLDivElement>}
        className={twMerge(baseStyles, variantStyles[variant], className)}
        style={combinedStyle}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
