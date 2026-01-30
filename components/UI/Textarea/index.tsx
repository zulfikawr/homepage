'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useRadius } from '@/contexts/radiusContext';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { radius } = useRadius();

    const defaultClassName =
      'w-full border bg-background p-2 shadow-sm focus:outline-none text-foreground';

    return (
      <textarea
        ref={ref}
        className={twMerge(defaultClassName, className)}
        style={{ borderRadius: `${radius}px` }}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
