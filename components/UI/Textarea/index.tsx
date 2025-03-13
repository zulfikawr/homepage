import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const defaultClassName =
      'w-full rounded-md border border-neutral-300 bg-neutral-50 p-2 shadow-sm focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-white';

    return (
      <textarea
        ref={ref}
        className={twMerge(defaultClassName, className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
