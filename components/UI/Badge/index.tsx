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
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'outline':
        return 'bg-transparent text-neutral-800 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600';
      default:
        return 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600';
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
        <span className='size-[12px] flex-shrink-0'>
          <Icon name={iconName!} />
        </span>
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge };
