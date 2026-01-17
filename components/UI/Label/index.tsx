import React from 'react';
import { Icon, IconName, iconMap } from '@/components/UI/Icon';
import { useRadius } from '@/contexts/radiusContext';
import { twMerge } from 'tailwind-merge';

type LabelTypes = 'primary' | 'secondary';

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

  // Explicitly check if the icon exists in our map
  const validIconName = icon && icon in iconMap ? icon : null;

  const baseClassName =
    'cursor-pointer justify-center font-medium items-center inline-flex w-auto lg:px-4 lg:py-1 px-2 py-1 text-center text-sm align-middle effect-pressing';

  const typeClassNames = {
    primary:
      'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-500 dark:text-blue-300',
    secondary:
      'bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-500 dark:text-neutral-300 focus:animate-pulse',
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
