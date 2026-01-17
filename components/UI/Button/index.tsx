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

const Button = ({
  type = 'default',
  nativeType = 'button',
  icon,
  className,
  children,
  ...rest
}: ButtonProps) => {
  const { radius } = useRadius();

  const getButtonClasses = () => {
    switch (type) {
      case 'primary':
        return 'py-2 px-5 h-9 shadow-sm border border-blue-500 dark:border-blue-900 dark:bg-blue-900 dark:text-neutral-300 bg-blue-500 hover:bg-blue-600 hover:border-blue-600 dark:hover:bg-blue-800 dark:hover:border-blue-800 hover:shadow-inner text-white';
      case 'destructive':
        return 'w-max py-2 px-5 h-9 shadow-sm border border-red-500 dark:border-red-900 dark:bg-red-900 dark:text-neutral-300 bg-red-500 hover:bg-red-600 hover:border-red-600 dark:hover:bg-red-800 dark:hover:border-red-800 hover:shadow-inner text-white';
      case 'outline':
        return 'w-max py-2 px-5 h-9 shadow-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:shadow-inner bg-transparent';
      case 'ghost':
        return 'w-max py-2 px-5 h-9 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-transparent text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100';
      case 'link':
        return 'w-max py-2 px-5 h-9 hover:underline bg-transparent text-blue-500 dark:text-blue-400';
      default:
        return 'w-max py-2 px-5 h-9 shadow-sm border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 hover:shadow-inner bg-white';
    }
  };

  return (
    <button
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
};

Button.displayName = 'Button';

export { Button };
