'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radius-context';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { radius } = useRadius();

    const defaultClassName =
      'h-9 w-full border-2 bg-background p-2 shadow-brutalist focus:outline-none text-foreground placeholder:text-muted-foreground hover:bg-card-header focus:bg-card-header transition-all duration-150 focus:shadow-brutalist-lg focus:-translate-y-0.5 hover:shadow-brutalist-xl';

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
