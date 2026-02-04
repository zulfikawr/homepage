'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { IconName } from '@/components/ui/icon';
import { useRadius } from '@/contexts/radius-context';

import { Icon, iconifyMap, iconMap } from '../icon';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'outline'
  | 'aqua'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'red';

interface Props {
  variant?: BadgeVariant;
  icon?: IconName | boolean;
  className?: string;
  children?: React.ReactNode;
}

export type BadgeProps = Props & React.HTMLAttributes<HTMLSpanElement>;

const getIconName = (toolName: string): IconName => {
  return toolName
    .toLowerCase()
    .replace(/[ .]/g, '')
    .replace('++', 'plusplus')
    .replace('#', 'sharp') as IconName;
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', icon, className, children, ...rest }, ref) => {
    const { radius } = useRadius();

    const getBadgeClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-primary text-primary-foreground hover:brightness-110 hover:shadow-brutalist-xl';
        case 'aqua':
          return 'bg-theme-aqua/15 text-theme-aqua border-theme-aqua/30 hover:bg-theme-aqua/25 hover:border-theme-aqua/60';
        case 'green':
          return 'bg-theme-green/15 text-theme-green border-theme-green/30 hover:bg-theme-green/25 hover:border-theme-green/60';
        case 'yellow':
          return 'bg-theme-yellow/15 text-theme-yellow border-theme-yellow/30 hover:bg-theme-yellow/25 hover:border-theme-yellow/60';
        case 'blue':
          return 'bg-theme-blue/15 text-theme-blue border-theme-blue/30 hover:bg-theme-blue/25 hover:border-theme-blue/60';
        case 'red':
          return 'bg-theme-red/15 text-theme-red border-theme-red/30 hover:bg-theme-red/25 hover:border-theme-red/60';
        case 'outline':
          return 'bg-transparent text-foreground border-border hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-brutalist-xl';
        default:
          return 'bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:border-muted-foreground/30';
      }
    };

    let iconName: IconName | undefined;
    if (typeof icon === 'string') {
      iconName = icon as IconName;
    } else if (icon === true && typeof children === 'string') {
      iconName = getIconName(children);
    }

    // Check if the icon actually exists in our mapping
    const hasValidIcon =
      iconName && (iconName in iconMap || iconName in iconifyMap);

    return (
      <span
        ref={ref}
        className={twMerge(
          'inline-flex items-center border-2 px-2.5 py-0.5 text-xs font-medium shadow-brutalist-sm select-none brutalist-interactive hover:shadow-brutalist-xl',
          hasValidIcon && 'gap-1.5',
          getBadgeClasses(),
          className,
        )}
        style={{ borderRadius: `${radius}px` }}
        {...rest}
      >
        {hasValidIcon && (
          <span className='size-[12px] flex-shrink-0 flex items-center justify-center'>
            <Icon name={iconName!} size={12} />
          </span>
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export { Badge };
