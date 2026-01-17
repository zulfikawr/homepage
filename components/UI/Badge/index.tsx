import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon, iconMap } from '../Icon';
import type { IconName } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';

type BadgeTypes = 'default' | 'primary' | 'outline';

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
  const hasValidIcon = iconName && iconName in iconMap;

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
