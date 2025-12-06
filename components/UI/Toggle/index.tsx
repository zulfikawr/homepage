import { useRadius } from '@/contexts/radiusContext';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ToggleProps {
  isActive?: boolean;
  onChange?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  isActive = false,
  onChange,
  children,
  className,
}) => {
  const { radius } = useRadius();

  const baseClasses =
    'flex items-center justify-center p-1 h-8 w-fit transition-colors duration-200';
  const activeClasses =
    'bg-blue-500 text-white dark:bg-blue-600 dark:text-neutral-100';
  const inactiveClasses =
    'bg-transparent text-neutral-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-600';

  return (
    <button
      className={twMerge(
        baseClasses,
        isActive ? activeClasses : inactiveClasses,
        className,
      )}
      onClick={onChange}
      style={{ borderRadius: `${radius}px` }}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};

Toggle.displayName = 'Toggle';

export { Toggle };
