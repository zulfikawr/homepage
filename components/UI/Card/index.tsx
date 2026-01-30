'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radiusContext';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'ghost';
  interactive?: boolean;
  // Legacy props for compatibility
  openForm?: boolean;
  isPreview?: boolean;
  isActive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      interactive = true,
      openForm,
      isPreview,
      isActive: legacyIsActive,
      className,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { radius } = useRadius();

    const isActive = variant === 'active' || legacyIsActive;
    const isActuallyInteractive = interactive && !isPreview;

    const baseStyles = twMerge(
      'group relative flex flex-col border shadow-md select-none transition-all duration-300',
      (openForm || isPreview) && 'w-full',
      isActive
        ? 'bg-primary/10 border-primary/50 dark:border-primary/40'
        : 'bg-card border-border backdrop-blur-none',
      isActuallyInteractive &&
        !isActive &&
        'cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:bg-primary/10 hover:border-primary/50 hover:dark:border-primary/40',
      variant === 'ghost' && 'bg-transparent border-transparent shadow-none',
      className,
    );

    return (
      <div
        ref={ref}
        className={baseStyles}
        style={{ borderRadius: `${radius}px` }}
        onClick={isPreview ? undefined : onClick}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export { Card };
