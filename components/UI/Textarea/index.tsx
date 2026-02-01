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
      'w-full border-2 bg-background p-2 shadow-brutalist focus:outline-none text-foreground placeholder:text-muted-foreground hover:bg-card-header focus:bg-card-header transition-all duration-150 focus:shadow-brutalist-lg focus:-translate-y-0.5 hover:shadow-brutalist-xl';

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
