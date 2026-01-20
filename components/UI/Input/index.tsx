'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRadius } from '@/contexts/radiusContext';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { radius } = useRadius();

    const defaultClassName =
      'h-9 w-full border border-input bg-background p-2 shadow-sm focus:outline-none text-foreground';

    return (
      <input
        ref={ref}
        className={twMerge(defaultClassName, className)}
        style={{ borderRadius: `${radius}px` }}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
