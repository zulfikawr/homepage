import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const defaultClassName =
      'h-9 w-full rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white';

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

export default Input;
