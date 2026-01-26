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
  | 'link';

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
      switch (type) {
        case 'primary':
          return 'py-2 px-5 h-9 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-inner';
        case 'destructive':
          return 'w-max py-2 px-5 h-9 shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-inner';
        case 'outline':
          return 'w-max py-2 px-5 h-9 shadow-sm border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-inner';
        case 'ghost':
          return 'w-max py-2 px-5 h-9 hover:bg-accent hover:text-accent-foreground bg-transparent text-muted-foreground';
        case 'link':
          return 'w-max py-2 px-5 h-9 hover:underline bg-transparent text-primary';
        default:
          return 'w-max py-2 px-5 h-9 shadow-sm border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-inner';
      }
    };

    return (
      <button
        ref={ref}
        type={nativeType}
        className={twMerge(
          'cursor-pointer focus:outline-none justify-center items-center text-sm lg:text-md tracking-wider flex select-none effect-pressing',
          getButtonClasses(),
          icon ? 'flex items-center gap-2' : '',
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
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
