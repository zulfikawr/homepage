'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Icon, iconifyMap, iconMap, IconName } from '@/components/ui/icon';
import { useRadius } from '@/contexts/radius-context';

type LabelVariant =
  | 'primary'
  | 'secondary'
  | 'aqua'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'red';

interface Props {
  variant: LabelVariant;
  icon?: IconName;
  children?: React.ReactNode;
}

type NativeAttrs = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  keyof Props
>;

type LabelProps = Props & NativeAttrs;

const Label = ({
  variant = 'primary',
  icon,
  children = 'Label',
  ...props
}: LabelProps) => {
  const { radius } = useRadius();

  // Explicitly check if the icon exists in our maps
  const validIconName =
    icon && (icon in iconMap || icon in iconifyMap) ? icon : null;

  const baseClassName =
    'cursor-pointer justify-center font-medium items-center border-2 inline-flex w-auto lg:px-4 lg:py-1 px-2 py-1 text-center text-sm align-middle shadow-brutalist brutalist-interactive';

  const variantClassNames = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary:
      'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:animate-pulse',
    aqua: 'bg-theme-aqua/10 text-theme-aqua border-theme-aqua/20 hover:bg-theme-aqua/20',
    green: 'bg-theme-green text-theme-bg hover:opacity-90',
    yellow: 'bg-theme-yellow text-theme-bg hover:opacity-90',
    blue: 'bg-theme-blue text-theme-bg hover:opacity-90',
    red: 'bg-theme-red text-white hover:opacity-90',
  };

  return (
    <label
      {...props}
      className={twMerge(baseClassName, variantClassNames[variant])}
      style={{ borderRadius: `${radius}px` }}
    >
      {validIconName && (
        <Icon name={validIconName} size={18} className='shrink-0 mr-1.5' />
      )}
      {children}
    </label>
  );
};

Label.displayName = 'Label';

export { Label, type LabelProps };
