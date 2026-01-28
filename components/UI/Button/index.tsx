'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon } from '@/components/UI';
import type { IconName } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';

type ButtonVariant =
  | 'default'
  | 'primary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'ghostLink';

interface Props {
  type?: ButtonVariant;
  nativeType?: 'button' | 'submit' | 'reset';
  icon?: IconName;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonProps = Props &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'default',
      nativeType = 'button',
      icon,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const { radius } = useRadius();

    const getButtonClasses = () => {
      const variants: Record<ButtonVariant, string> = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost:
          'hover:bg-accent hover:text-accent-foreground bg-transparent text-muted-foreground',
        link: 'hover:underline bg-transparent text-primary',
        ghostLink:
          'bg-transparent text-muted-foreground hover:text-primary transition-colors',
        default:
          'border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground',
      };

      return twMerge(
        'py-2 px-5 h-9',
        type !== 'primary' && 'w-max',
        !['ghost', 'link', 'ghostLink'].includes(type) && 'shadow-sm hover:shadow-inner',
        variants[type],
      );
    };

    return (
      <button
        ref={ref}
        type={nativeType}
        className={twMerge(
          'cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex select-none effect-pressing transition-color duration-100',
          type === 'ghostLink' && 'hover:[&>svg]:opacity-100',
          getButtonClasses(),
          icon && 'flex items-center gap-2',
          (type === 'link' || type === 'ghostLink') && 'relative pb-1',
          className,
        )}
        style={{ borderRadius: `${radius}px` }}
        {...rest}
      >
        {icon && (
          <span className='size-5 flex-shrink-0'>
            <Icon name={icon} />
          </span>
        )}
        {children}
        {(type === 'link' || type === 'ghostLink') && (
          <svg
            className={`absolute bottom-0 left-0 w-full pointer-events-none transition-opacity duration-300 ${
              type === 'ghostLink' ? 'opacity-0' : ''
            }`}
            height='4'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
            viewBox='0 0 100 4'
          >
            <path
              d='M 0,2 Q 2,0 4,2 T 8,2 T 12,2 T 16,2 T 20,2 T 24,2 T 28,2 T 32,2 T 36,2 T 40,2 T 44,2 T 48,2 T 52,2 T 56,2 T 60,2 T 64,2 T 68,2 T 72,2 T 76,2 T 80,2 T 84,2 T 88,2 T 92,2 T 96,2 Q 98,0 100,2'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              opacity='0.8'
            />
          </svg>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
