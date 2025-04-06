import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '../Icon';

type BadgeTypes = 'default' | 'primary' | 'outline';

interface Props {
  type?: BadgeTypes;
  icon?: string | boolean;
  className?: string;
  children?: React.ReactNode;
  [prop: string]: unknown;
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLSpanElement>, keyof Props>;

export type BadgeProps = Props & NativeAttrs;

const getIconName = (toolName: string): string => {
  return toolName
    .toLowerCase()
    .replace(/[ .]/g, '')
    .replace('++', 'plusplus')
    .replace('#', 'sharp');
};

const Badge = ({
  type = 'default',
  icon,
  className,
  children,
  ...rest
}: BadgeProps) => {
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

  let iconName: string | undefined;
  if (typeof icon === 'string') {
    iconName = icon;
  } else if (icon === true && typeof children === 'string') {
    iconName = getIconName(children);
  }

  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium gap-1.5 shadow-sm',
        getBadgeClasses(),
        className,
      )}
      {...rest}
    >
      {iconName && (
        <span className='size-[12px] flex-shrink-0'>
          <Icon name={iconName} />
        </span>
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge };
