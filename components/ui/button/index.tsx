'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { IconName } from '@/components/ui/icon';
import { useRadius } from '@/contexts/radius-context';

import { Icon } from '../icon';

type ButtonVariant =
  | 'default'
  | 'primary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'ghostLink';

interface Props {
  variant?: ButtonVariant;
  nativeType?: 'button' | 'submit' | 'reset';
  icon?: IconName;
  iconClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonProps = Props &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      nativeType = 'button',
      icon,
      iconClassName,
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
        link: 'bg-transparent text-primary',
        ghostLink:
          'bg-transparent text-muted-foreground hover:text-primary transition-colors',
        default:
          'border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground',
      };

      return twMerge(
        'h-8',
        variant !== 'primary' && 'w-max',
        !['ghost', 'link', 'ghostLink'].includes(variant) &&
          'shadow-brutalist border-2 brutalist-interactive hover:shadow-brutalist-lg',
        variants[variant],
      );
    };

    return (
      <button
        ref={ref}
        type={nativeType}
        className={twMerge(
          'cursor-pointer focus:outline-none inline-flex justify-center items-center text-sm lg:text-md tracking-wider inline-flex select-none effect-pressing',
          getButtonClasses(),
          icon && children && 'gap-2',
          variant === 'link' && 'squiggly-underline',
          variant === 'ghostLink' && 'hover:squiggly-underline',
          className,
        )}
        style={{ borderRadius: `${radius}px` }}
        {...rest}
      >
        {icon && <Icon name={icon} size={20} className={iconClassName} />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
