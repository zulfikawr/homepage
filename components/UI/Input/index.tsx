import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const defaultClassName =
      'h-9 w-full rounded-md border border-neutral-300 bg-neutral-50 p-2 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white';

    return (
      <input
        ref={ref}
        className={twMerge(defaultClassName, className)}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';

export { Input };
