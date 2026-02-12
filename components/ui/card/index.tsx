'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radius-context';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'ghost';
  interactive?: boolean;
  openForm?: boolean;
  isPreview?: boolean;
  isActive?: boolean;
  overflowVisible?: boolean;
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
      overflowVisible,
      ...props
    },
    ref,
  ) => {
    const { radius } = useRadius();

    const isActive = variant === 'active' || legacyIsActive;
    const isActuallyInteractive = interactive && !isPreview;

    const baseStyles = twMerge(
      'group relative flex flex-col select-none transition-all duration-150 overflow-visible shadow-brutalist border-2',
      (openForm || isPreview) && 'w-full',
      isActive
        ? 'bg-primary/10 border-primary/50 dark:border-primary/40'
        : 'bg-card border-border backdrop-blur-none',
      isActuallyInteractive &&
        !isActive &&
        'cursor-pointer brutalist-interactive hover:shadow-brutalist-xl hover:bg-primary/10 hover:border-primary/50 hover:dark:border-primary/40',
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
        <div
          className={`flex-1 flex flex-col ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} h-full w-full`}
          style={{ borderRadius: radius > 0 ? `${radius - 2}px` : undefined }}
        >
          {children}
        </div>
      </div>
    );
  },
);

Card.displayName = 'Card';

export { Card };
