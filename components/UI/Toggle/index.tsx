'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radiusContext';

interface ToggleProps {
  isActive?: boolean;
  onChange?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Toggle: React.FC<ToggleProps> = ({
  isActive = false,
  onChange,
  children,
  className,
  style,
}) => {
  const { radius } = useRadius();

  const baseClasses =
    'flex items-center justify-center p-1 h-8 w-fit cursor-pointer select-none transition-all duration-150 border-2 shadow-brutalist brutalist-interactive hover:shadow-brutalist-xl';
  const activeClasses =
    'bg-primary text-primary-foreground hover:brightness-110 hover:shadow-brutalist-xl';
  const inactiveClasses =
    'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground';

  return (
    <button
      className={twMerge(
        baseClasses,
        isActive ? activeClasses : inactiveClasses,
        className,
      )}
      onClick={onChange}
      style={{ borderRadius: `${radius}px`, ...style }}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

Toggle.displayName = 'Toggle';

export { Toggle };
