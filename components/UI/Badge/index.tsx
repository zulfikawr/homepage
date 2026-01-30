'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { IconName } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';

import { Icon, iconifyMap, iconMap } from '../Icon';

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
          return 'bg-primary text-primary-foreground hover:brightness-110 hover:shadow-md';
        case 'aqua':
          return 'bg-gruv-aqua/15 text-gruv-aqua border-gruv-aqua/30 hover:bg-gruv-aqua/25 hover:border-gruv-aqua/60';
        case 'green':
          return 'bg-gruv-green/15 text-gruv-green border-gruv-green/30 hover:bg-gruv-green/25 hover:border-gruv-green/60';
        case 'yellow':
          return 'bg-gruv-yellow/15 text-gruv-yellow border-gruv-yellow/30 hover:bg-gruv-yellow/25 hover:border-gruv-yellow/60';
        case 'blue':
          return 'bg-gruv-blue/15 text-gruv-blue border-gruv-blue/30 hover:bg-gruv-blue/25 hover:border-gruv-blue/60';
        case 'red':
          return 'bg-gruv-red/15 text-gruv-red border-gruv-red/30 hover:bg-gruv-red/25 hover:border-gruv-red/60';
        case 'outline':
          return 'bg-transparent text-foreground border-border hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-sm';
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
          'inline-flex items-center border-2 px-2.5 py-0.5 text-xs font-medium shadow-brutalist-sm select-none brutalist-interactive',
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
