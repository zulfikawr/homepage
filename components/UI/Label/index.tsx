'use client';

import React from 'react';
import { Icon, IconName, iconMap, iconifyMap } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';
import { twMerge } from 'tailwind-merge';

type LabelTypes =
  | 'primary'
  | 'secondary'
  | 'aqua'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'red';

interface Props {
  type: LabelTypes;
  icon?: IconName;
  children?: React.ReactNode;
}

type NativeAttrs = Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  keyof Props
>;

type LabelProps = Props & NativeAttrs;

const Label = ({
  type = 'primary',
  icon,
  children = 'Label',
  ...props
}: LabelProps) => {
  const { radius } = useRadius();

  // Explicitly check if the icon exists in our maps
  const validIconName =
    icon && (icon in iconMap || icon in iconifyMap) ? icon : null;

  const baseClassName =
    'cursor-pointer justify-center font-medium items-center inline-flex w-auto lg:px-4 lg:py-1 px-2 py-1 text-center text-sm align-middle effect-pressing';

  const typeClassNames = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary:
      'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:animate-pulse',
    aqua: 'bg-gruv-aqua text-gruv-bg hover:opacity-90',
    green: 'bg-gruv-green text-gruv-bg hover:opacity-90',
    yellow: 'bg-gruv-yellow text-gruv-bg hover:opacity-90',
    blue: 'bg-gruv-blue text-gruv-bg hover:opacity-90',
    red: 'bg-gruv-red text-white hover:opacity-90',
  };

  return (
    <label
      {...props}
      className={twMerge(baseClassName, typeClassNames[type])}
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

export { Label };
