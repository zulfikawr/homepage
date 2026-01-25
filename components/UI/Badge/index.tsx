'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon, iconMap, iconifyMap } from '../Icon';
import type { IconName } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';

type BadgeTypes =
  | 'default'
  | 'primary'
  | 'outline'
  | 'aqua'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'red';

interface Props {
  type?: BadgeTypes;
  icon?: IconName | boolean;
  className?: string;
  children?: React.ReactNode;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLSpanElement>, keyof Props>;
export type BadgeProps = Props & NativeAttrs;

const getIconName = (toolName: string): IconName => {
  return toolName
    .toLowerCase()
    .replace(/[ .]/g, '')
    .replace('++', 'plusplus')
    .replace('#', 'sharp') as IconName;
};

const Badge = ({
  type = 'default',
  icon,
  className,
  children,
  ...rest
}: BadgeProps) => {
  const { radius } = useRadius();

  const getBadgeClasses = () => {
    switch (type) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/80';
      case 'aqua':
        return 'bg-gruv-aqua/10 text-gruv-aqua border-gruv-aqua/20 hover:bg-gruv-aqua/20';
      case 'green':
        return 'bg-gruv-green/10 text-gruv-green border-gruv-green/20 hover:bg-gruv-green/20';
      case 'yellow':
        return 'bg-gruv-yellow/10 text-gruv-yellow border-gruv-yellow/20 hover:bg-gruv-yellow/20';
      case 'blue':
        return 'bg-gruv-blue/10 text-gruv-blue border-gruv-blue/20 hover:bg-gruv-blue/20';
      case 'red':
        return 'bg-gruv-red/10 text-gruv-red border-gruv-red/20 hover:bg-gruv-red/20';
      case 'outline':
        return 'bg-transparent text-foreground border border-border';
      default:
        return 'bg-muted text-muted-foreground border border-border';
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
      className={twMerge(
        'inline-flex items-center border px-2.5 py-0.5 text-xs font-medium shadow-sm',
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
};

Badge.displayName = 'Badge';

export { Badge };
